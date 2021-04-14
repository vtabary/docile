import { MockedLogger } from '../../../logger/logger.mock';
import { ErrorSource } from './error';

describe('ErrorSource', () => {
  let source: ErrorSource;
  let logger: MockedLogger;

  beforeEach(() => {
    logger = new MockedLogger();
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new ErrorSource({ id: 'test' }, { logger })).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      source = new ErrorSource({ id: 'test' }, { logger });
    });

    it('should throw', async () => {
      await expect(source.download()).rejects.toThrow(
        `Can't copy the source "test"`
      );
    });
  });
});
