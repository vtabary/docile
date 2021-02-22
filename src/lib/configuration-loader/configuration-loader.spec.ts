import { promises } from 'fs-extra';
import { resolve } from 'path';
import { Documentation } from '../models/documentation/documentation';
import { Configurationloader, WRAPPERS } from './configuration-loader';

describe('Configurationloader', () => {
  let loader: Configurationloader;

  beforeEach(() => {
    // Mock the external calls
    jest.spyOn(promises, 'readFile').mockImplementation(async () => '');
    jest
      .spyOn(WRAPPERS, 'findUp')
      .mockImplementation(async () => '/some/.docile.yml');
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Configurationloader()).not.toThrow();
    });
  });

  describe('#load', () => {
    beforeEach(() => {
      loader = new Configurationloader();
    });

    it('should use the current working directory as default', async () => {
      await loader.load();
      expect(WRAPPERS.findUp).toHaveBeenCalledWith('.docile.yml', {
        cwd: process.cwd(),
      });
    });

    it('should return an empty object when the parsing is failing', async () => {
      jest.spyOn(promises, 'readFile').mockImplementation(async () => '{');
      expect(loader.load()).resolves.toEqual({
        documentation: expect.any(Documentation),
        build: {
          outDir: '/some/public/docs',
          tmpDir: '/some/.tmp',
          templatesDir: resolve('templates'),
          cwd: '/some',
        },
      });
    });

    it('should return an empty object when the file has not been found', async () => {
      jest.spyOn(WRAPPERS, 'findUp').mockImplementation(async () => undefined);
      expect(loader.load()).rejects.toEqual(expect.any(Error));
    });

    it('should return a Documentation object', async () => {
      expect(loader.load()).resolves.toEqual({
        documentation: expect.any(Documentation),
        build: {
          outDir: '/some/public/docs',
          tmpDir: '/some/.tmp',
          templatesDir: resolve('templates'),
          cwd: '/some',
        },
      });
    });

    it('should consider a different working directory', async () => {
      expect(loader.load({ cwd: '/some/project' })).resolves.toEqual({
        documentation: expect.any(Documentation),
        build: {
          outDir: '/some/public/docs',
          tmpDir: '/some/.tmp',
          templatesDir: resolve('templates'),
          cwd: '/some',
        },
      });
    });

    it('should support an empty documentation configuration', async () => {
      jest.spyOn(promises, 'readFile').mockImplementation(
        async () => `build:
  outDir: ./public/docs
`
      );
      const documentation = await loader.load();
      expect(documentation.documentation.label).toEqual(
        'Untitled documentation'
      );
      expect(documentation.documentation.versions.length).toEqual(0);
      expect(documentation.build).toEqual({
        outDir: '/some/public/docs',
        templatesDir: resolve('templates'),
        tmpDir: '/some/.tmp',
        cwd: '/some',
      });
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
          path: ./docs1
        src2:
          type: local
          path: ./docs2
    V12:
      label: v12.x
      sources:
        src1:
          type: local
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
