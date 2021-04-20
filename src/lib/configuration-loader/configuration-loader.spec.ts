import { promises } from 'fs-extra';
import { resolve } from 'path';
import { ConfigurationLoader, WRAPPERS } from './configuration-loader';

describe('ConfigurationLoader', () => {
  let loader: ConfigurationLoader;

  beforeEach(() => {
    // Mock the external calls
    jest.spyOn(promises, 'readFile').mockImplementation(
      async () => `documentation:
  label: Local documentation
  summary: ./summary.md
  versions:
    latest:
      label: latest
      sources:
        src1:
          type: local
          options:
            path: ./docs1
build:
  outDir: ./public/docs
`
    );
    jest
      .spyOn(WRAPPERS, 'findUp')
      .mockImplementation(async () => '/some/.docile.yml');
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new ConfigurationLoader()).not.toThrow();
    });
  });

  describe('#load', () => {
    beforeEach(() => {
      loader = new ConfigurationLoader();
    });

    it('should use the current working directory as default', async () => {
      await loader.load();
      expect(WRAPPERS.findUp).toHaveBeenCalledWith('.docile.yml', {
        cwd: process.cwd(),
      });
    });

    it('should throw when the parsing is failing', async () => {
      jest.spyOn(promises, 'readFile').mockImplementation(async () => '{');
      await expect(loader.load()).rejects.toEqual(
        new Error('Invalid configuration')
      );
    });

    it('should return an empty object when the file has not been found', async () => {
      jest.spyOn(WRAPPERS, 'findUp').mockImplementation(async () => undefined);
      await expect(loader.load()).rejects.toEqual(expect.any(Error));
    });

    it('should return a Documentation object', async () => {
      await expect(loader.load()).resolves.toEqual({
        documentation: {
          label: 'Local documentation',
          versions: [
            {
              id: 'latest',
              label: 'latest',
              sources: [
                {
                  id: 'src1',
                  type: 'local',
                  options: {
                    path: './docs1',
                  },
                },
              ],
            },
          ],
        },
        build: {
          outDir: '/some/public/docs',
          tmpDir: '/some/.tmp',
          templatesDir: resolve('templates'),
          cwd: '/some',
        },
      });
    });

    it('should consider a different working directory', async () => {
      await expect(loader.load({ cwd: '/some/project' })).resolves.toEqual({
        documentation: {
          label: 'Local documentation',
          versions: [
            {
              id: 'latest',
              label: 'latest',
              sources: [
                {
                  id: 'src1',
                  type: 'local',
                  options: {
                    path: './docs1',
                  },
                },
              ],
            },
          ],
        },
        build: {
          outDir: '/some/public/docs',
          tmpDir: '/some/.tmp',
          templatesDir: resolve('templates'),
          cwd: '/some',
        },
      });
    });

    it('should throw for an empty documentation configuration', async () => {
      jest.spyOn(promises, 'readFile').mockImplementation(
        async () => `build:
  outDir: ./public/docs
`
      );
      await expect(loader.load()).rejects.toEqual(
        new Error('Invalid configuration')
      );
    });

    it('should support an empty build configuration', async () => {
      jest.spyOn(promises, 'readFile').mockImplementation(
        async () => `documentation:
  label: Local documentation
  summary: ./summary.md
  versions:
    latest:
      label: latest
      sources:
        src1:
          type: local
          options:
            path: ./docs1
        src2:
          type: local
          options:
            path: ./docs2
    V12:
      label: v12.x
      sources:
        src1:
          type: local
          options:
            path: ./docs
`
      );
      const documentation = await loader.load();
      expect(documentation.build).toEqual({
        outDir: '/some/public/docs',
        templatesDir: resolve('templates'),
        tmpDir: '/some/.tmp',
        cwd: '/some',
      });
    });
  });
});
