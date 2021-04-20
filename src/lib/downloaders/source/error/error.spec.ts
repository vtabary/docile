import { MockedLogger } from '../../../logger/logger.mock';
import { IDocumentation } from '../../../models/documentation';
import { IVersion } from '../../../models/version';
import { ErrorSourceDownloader } from './error';

describe('ErrorSource', () => {
  let logger: MockedLogger;
  let documentation: IDocumentation;
  let version: IVersion;
  let source: ErrorSourceDownloader;

  beforeEach(() => {
    logger = new MockedLogger();
    documentation = {
      versions: [],
    };
    version = {
      id: 'test',
      sources: [],
    };
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
        source.download({
          documentation,
          version,
          source: { id: 'test', type: 'unknown', options: {} },
        })
      ).rejects.toThrow(`Can't copy the source "test"`);
    });
  });
});
