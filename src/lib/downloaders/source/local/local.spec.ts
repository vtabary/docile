import { MockedLogger } from '../../../logger/logger.mock';
import { ILocalSource, LocalSourceDownloader, WRAPPERS } from './local';

describe('LocalSourceDownloader', () => {
  let downloader: LocalSourceDownloader;
  let source: ILocalSource;
  let options: { logger: MockedLogger; cwd: string; downloadDir: string };
  let mCopy: jest.SpyInstance;

  beforeEach(() => {
    mCopy = jest.spyOn(WRAPPERS, 'copy');
    mCopy.mockImplementation(async () => undefined);

    options = {
      logger: new MockedLogger(),
      cwd: '/some',
      downloadDir: '.tmp',
    };
    source = {
      id: 'test',
      type: 'local',
      options: {
        path: '/dir/content.md',
      },
    };
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new LocalSourceDownloader(options)).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      mCopy.mockReset();
      jest.spyOn(options.logger, 'info').mockReturnValue(undefined);

      downloader = new LocalSourceDownloader(options);
    });

    it('should copy the file', async () => {
      await downloader.download(source);
      expect(options.logger.info).toHaveBeenCalledWith(`Copying local files...
  from "/dir/content.md"
  to "/some/.tmp/test"`);
      expect(mCopy).toHaveBeenCalledWith('/dir/content.md', '/some/.tmp/test');
    });

    it('should copy a dir', async () => {
      source.options.path = '/some/dir';

      await downloader.download(source);
      expect(options.logger.info).toHaveBeenCalledWith(`Copying local files...
  from "/some/dir"
  to "/some/.tmp/test"`);
      expect(mCopy).toHaveBeenCalledWith('/some/dir', '/some/.tmp/test');
    });

    it('should throw when the download can not be done', async () => {
      mCopy.mockImplementation(async () =>
        Promise.reject(new Error('some copy error'))
      );
      await expect(downloader.download(source)).rejects.toThrow(
        'some copy error'
      );
    });
  });
});
