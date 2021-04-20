import { MockedLogger } from '../../../logger/logger.mock';
import { ErrorSourceDownloader } from './error';

describe('ErrorSource', () => {
  let source: ErrorSourceDownloader;
  let logger: MockedLogger;

  beforeEach(() => {
    logger = new MockedLogger();
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new ErrorSourceDownloader({ logger })).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      source = new ErrorSourceDownloader({ logger });
    });

    it('should throw', async () => {
      await expect(
        source.download({ id: 'test', type: 'unknown', options: {} })
      ).rejects.toThrow(`Can't copy the source "test"`);
    });
  });
});
