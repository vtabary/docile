import { IBuildContext } from '../../build-context/build-context';
import { LocalSource, WRAPPERS } from './local';

describe('LocalSource', () => {
  let source: LocalSource;
  let mCopy: jest.SpyInstance;
  let context: IBuildContext;

  beforeEach(() => {
    context = {
      cwd: '/test',
      outDir: '/test/out',
      templatesDir: '/test/templates',
      tmpDir: '/test/.tmp',
    };

    mCopy = jest.spyOn(WRAPPERS, 'copy');
    mCopy.mockImplementation(async () => undefined);
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(
        () =>
          new LocalSource(
            {
              path: 'http://test/content.md',
              id: 'test',
            },
            context
          )
      ).not.toThrow();
    });

    it('should set the id', () => {
      const obj = new LocalSource(
        {
          path: '/some/dir/content.md',
          id: 'test',
        },
        context
      );
      expect(obj.id).toEqual('test');
    });

    it('should set the path', () => {
      const obj = new LocalSource(
        {
          path: '/some/dir/content.md',
          id: 'test',
        },
        context
      );
      expect(obj.path).toEqual('/some/dir/content.md');
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      mCopy.mockReset();

      spyOn(console, 'log').and.stub();
      source = new LocalSource(
        {
          path: '/some/dir/content.md',
          id: 'test',
        },
        context
      );
    });

    it('should copy the file', async () => {
      await source.download('/tmp');
      expect(console.log).toHaveBeenCalledWith(`Copying local files...
  from "/some/dir/content.md"
  to "/tmp/test"`);
      expect(mCopy).toHaveBeenCalledWith('/some/dir/content.md', '/tmp/test');
    });

    it('should copy a dir', async () => {
      source.path = '/some/dir';

      await source.download('/tmp');
      expect(console.log).toHaveBeenCalledWith(`Copying local files...
  from "/some/dir"
  to "/tmp/test"`);
      expect(mCopy).toHaveBeenCalledWith('/some/dir', '/tmp/test');
    });

    it('should throw when the download can not be done', async () => {
      mCopy.mockImplementation(async () =>
        Promise.reject(new Error('some copy error'))
      );
      await expect(source.download('/tmp')).rejects.toThrow('some copy error');
    });
  });
});
