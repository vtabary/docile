import { MockedLogger } from '../../logger/logger.mock';
import { SourceDownloader } from './source';

describe('SourceDownloader', () => {
  let options: { logger: MockedLogger; cwd: string; downloadDir: string };

  beforeEach(() => {
    options = {
      logger: new MockedLogger(),
      cwd: '/some',
      downloadDir: '.tmp',
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
