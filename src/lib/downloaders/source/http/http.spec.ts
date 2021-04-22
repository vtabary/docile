import { MockedLogger } from '../../../logger/logger.mock';
import { IDocumentation } from '../../../models/documentation';
import { IVersion } from '../../../models/version';
import { HttpSourceDownloader, IHttpSource, WRAPPERS } from './http';

describe('HttpSourceDownloader', () => {
  let downloader: HttpSourceDownloader;
  let documentation: IDocumentation;
  let version: IVersion;
  let source: IHttpSource;
  let options: { logger: MockedLogger; cwd: string; downloadDir: string };
  let mDownload: jest.SpyInstance;

  beforeEach(() => {
    mDownload = jest.spyOn(WRAPPERS, 'download');
    mDownload.mockImplementation(async () => undefined);

    options = { logger: new MockedLogger(), cwd: '/some', downloadDir: '.tmp' };
    documentation = {
      versions: [],
    };
    version = {
      id: 'test-version',
      sources: [],
    };
    source = {
      id: 'test-source',
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
      await downloader.download({ documentation, version, source });
      expect(options.logger.info)
        .toHaveBeenCalledWith(`Copying remote HTTP files...
  from "http://test/content.md"
  to "/some/.tmp/test-version/test-source"`);
      expect(mDownload).toHaveBeenCalledWith(
        'http://test/content.md',
        '/some/.tmp/test-version/test-source',
        { extract: true }
      );
    });

    it('should throw when the download can not be done', async () => {
      mDownload.mockImplementation(async () =>
        Promise.reject(new Error('some download error'))
      );
      await expect(
        downloader.download({ documentation, version, source })
      ).rejects.toThrow('some download error');
    });
  });
});
