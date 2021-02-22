import { IBuildContext } from '../../models/build-context/build-context';
import { Version } from '../../models/version/version';
import { VersionBuilder } from './version';

describe('VersionBuilder', () => {
  let builder: VersionBuilder;
  let context: IBuildContext;

  beforeEach(() => {
    context = {
      cwd: '/test',
      outDir: '/test/out',
      templatesDir: '/test/templates',
      tmpDir: '/test/.tmp',
    };
  });

  describe('#new', () => {
    it('should create a new instance', () => {
      expect(() => new VersionBuilder(context)).not.toThrow();
    });
  });

  describe('#build', () => {
    beforeEach(() => {
      builder = new VersionBuilder(context);
    });

    it('should return a Version object', () => {
      const version = builder.build({ id: 'test', sources: {} });
      expect(version).toEqual(expect.any(Version));
      expect(version).toEqual(
        expect.objectContaining({
          id: 'test',
          sources: [],
        })
      );
    });

    it('should set the sources', () => {
      const version = builder.build({
        id: 'test',
        sources: { test: { path: '/tmp', type: 'local' } },
      });
      expect(version).toEqual(
        expect.objectContaining({
          id: 'test',
          sources: [expect.objectContaining({ id: 'test', path: '/tmp' })],
        })
      );
    });
  });
});
