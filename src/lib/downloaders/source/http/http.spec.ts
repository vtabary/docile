import { MockedLogger } from '../../../logger/logger.mock';
import { HttpSourceDownloader, IHttpSource, WRAPPERS } from './http';

describe('HttpSourceDownloader', () => {
  let downloader: HttpSourceDownloader;
  let source: IHttpSource;
  let options: { logger: MockedLogger; cwd: string; downloadDir: string };
  let mDownload: jest.SpyInstance;

  beforeEach(() => {
    mDownload = jest.spyOn(WRAPPERS, 'download');
    mDownload.mockImplementation(async () => undefined);

    options = { logger: new MockedLogger(), cwd: '/some', downloadDir: '.tmp' };
    source = {
      id: 'test',
      type: 'http',
      options: {
        path: 'http://test/content.md',
      },
    };
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new HttpSourceDownloader(options)).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      jest.spyOn(options.logger, 'info').mockReturnValue(undefined);

      downloader = new HttpSourceDownloader(options);
    });

    it('should download the file', async () => {
      await downloader.download(source);
      expect(options.logger.info)
        .toHaveBeenCalledWith(`Copying remote HTTP files...
  from "http://test/content.md"
  to "/some/.tmp/test"`);
      expect(mDownload).toHaveBeenCalledWith(
        'http://test/content.md',
        '/some/.tmp/test',
        { extract: true }
      );
    });

    it('should throw when the download can not be done', async () => {
      mDownload.mockImplementation(async () =>
        Promise.reject(new Error('some download error'))
      );
      await expect(downloader.download(source)).rejects.toThrow(
        'some download error'
      );
    });
  });
});
