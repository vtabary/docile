import { promises } from 'fs-extra';
import { ConfigurationLoader, WRAPPERS } from './configuration-loader';

describe('ConfigurationLoader', () => {
  let loader: ConfigurationLoader;

  beforeEach(() => {
    // Mock the external calls
    jest.spyOn(promises, 'readFile').mockImplementation(
      async () => `label: Local documentation
summary: ./summary.md
versions:
  latest:
    label: latest
    sources:
      src1:
        type: local
        options:
          path: ./docs1
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
      await loader.load({ projectDir: '/some/project' });
      expect(WRAPPERS.findUp).toHaveBeenCalledWith('.docile.yml', {
        cwd: '/some/project',
      });
    });

    it('should throw when the parsing is failing', async () => {
      jest.spyOn(promises, 'readFile').mockImplementation(async () => '{');
      await expect(
        loader.load({ projectDir: '/some/project' })
      ).rejects.toEqual(new Error('Invalid configuration'));
    });

    it('should return an empty object when the file has not been found', async () => {
      jest.spyOn(WRAPPERS, 'findUp').mockImplementation(async () => undefined);
      await expect(
        loader.load({ projectDir: '/some/project' })
      ).rejects.toEqual(expect.any(Error));
    });

    it('should return a Documentation object', async () => {
      await expect(
        loader.load({ projectDir: '/some/project' })
      ).resolves.toEqual({
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
      });
    });

    it('should consider a different working directory', async () => {
      await expect(
        loader.load({ projectDir: '/some/project' })
      ).resolves.toEqual({
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
      });
    });

    it('should throw for an empty documentation configuration', async () => {
      jest.spyOn(promises, 'readFile').mockImplementation(
        async () => `build:
  outDir: ./public/docs
`
      );
      await expect(
        loader.load({ projectDir: '/some/project' })
      ).rejects.toEqual(new Error('Invalid configuration'));
    });
  });
});
