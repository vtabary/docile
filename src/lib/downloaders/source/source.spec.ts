import { MockedLogger } from '../../logger/logger.mock';
import { PluginRegistry } from '../../plugin-registry/plugin-registry';
import { ISourceDownloader, SourceDownloader } from './source';

describe('SourceDownloader', () => {
  let options: {
    logger: MockedLogger;
    cwd: string;
    downloadDir: string;
    downloaders: PluginRegistry<ISourceDownloader>;
  };

  beforeEach(() => {
    options = {
      logger: new MockedLogger(),
      cwd: '/some',
      downloadDir: '.tmp',
      downloaders: new PluginRegistry(),
    };
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new SourceDownloader(options)).not.toThrow();
    });
  });

  describe('#download', () => {
    it('should', () => {
      pending('TODO');
    });
  });
});
