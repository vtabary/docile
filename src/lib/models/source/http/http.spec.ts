import { Logger } from '../../../logger/logger';
import { MockedLogger } from '../../../logger/logger.mock';
import { HttpSource, WRAPPERS } from './http';

describe('HttpSource', () => {
  let source: HttpSource;
  let mDownload: jest.SpyInstance;
  let logger: Logger;

  beforeEach(() => {
    logger = new MockedLogger();
    mDownload = jest.spyOn(WRAPPERS, 'download');
    mDownload.mockImplementation(async () => undefined);
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(
        () =>
          new HttpSource(
            {
              path: 'http://test/content.md',
              id: 'test',
            },
            { logger }
          )
      ).not.toThrow();
    });

    it('should set the path', () => {
      const obj = new HttpSource(
        {
          path: 'http://test/content.md',
          id: 'test',
        },
        { logger }
      );
      expect(obj.path).toEqual('http://test/content.md');
    });

    it('should set the id', () => {
      const obj = new HttpSource(
        {
          path: 'http://test/content.md',
          id: 'test',
        },
        { logger }
      );
      expect(obj.id).toEqual('test');
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      mDownload.mockReset();
      jest.spyOn(logger, 'info').mockReturnValue(undefined);

      source = new HttpSource(
        {
          path: 'http://test/content.md',
          id: 'test',
        },
        { logger }
      );
    });

    it('should download the file', async () => {
      await source.download('/tmp');
      expect(logger.info).toHaveBeenCalledWith(`Copying remote HTTP files...
  from "http://test/content.md"
  to "/tmp/test"`);
      expect(mDownload).toHaveBeenCalledWith(
        'http://test/content.md',
        '/tmp/test',
        { extract: true }
      );
    });

    it('should throw when the download can not be done', async () => {
      mDownload.mockImplementation(async () =>
        Promise.reject(new Error('some download error'))
      );
      await expect(source.download('/tmp')).rejects.toThrow(
        'some download error'
      );
    });
  });
});
