import { resolve } from 'path';
import { ContextBuilder } from './context';

describe('ContextBuilder', () => {
  let builder: ContextBuilder;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new ContextBuilder()).not.toThrow();
    });
  });

  describe('#build', () => {
    beforeEach(() => {
      builder = new ContextBuilder();
    });

    it('should return a default object when the configuration is undefined', () => {
      expect(builder.build(undefined)).toEqual({
        outDir: resolve(process.cwd(), 'public/docs'),
        templatesDir: resolve(process.cwd(), 'templates'),
        tmpDir: resolve(process.cwd(), '.tmp'),
        cwd: process.cwd(),
      });
    });

    it('should consider a custom working directory', () => {
      expect(builder.build(undefined, { cwd: '/some/dir' })).toEqual({
        outDir: '/some/dir/public/docs',
        templatesDir: resolve(process.cwd(), 'templates'),
        tmpDir: '/some/dir/.tmp',
        cwd: '/some/dir',
      });
    });

    it('should set the absolute custom paths', () => {
      expect(
        builder.build(
          {
            outDir: '/some/out-dir',
            templatesDir: '/some/template-dir',
            tmpDir: '/some/tmp-dir',
          },
          { cwd: '/some/path' }
        )
      ).toEqual({
        outDir: '/some/out-dir',
        templatesDir: '/some/template-dir',
        tmpDir: '/some/tmp-dir',
        cwd: '/some/path',
      });
    });

    it('should convert the relative paths to absolute paths', () => {
      expect(
        builder.build(
          {
            outDir: 'out-dir',
            templatesDir: 'template-dir',
            tmpDir: 'tmp-dir',
          },
          { cwd: '/some/path' }
        )
      ).toEqual({
        outDir: '/some/path/out-dir',
        templatesDir: '/some/path/template-dir',
        tmpDir: '/some/path/tmp-dir',
        cwd: '/some/path',
      });
    });
  });
});
