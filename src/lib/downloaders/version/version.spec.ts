import { MockedLogger } from '../../logger/logger.mock';
import { IDocumentation } from '../../models/documentation';
import { IVersion } from '../../models/version';
import { SourceDownloader } from '../source/source';
import { VersionDownloader } from './version';

describe('VersionDownloader', () => {
  let downloader: VersionDownloader;
  let options: { logger: MockedLogger; cwd: string; downloadDir: string };
  let documentation: IDocumentation;
  let version: IVersion;
  let spySource: jest.SpyInstance;

  beforeEach(() => {
    spySource = jest.spyOn(SourceDownloader.prototype, 'download');
    spySource.mockResolvedValue(undefined);

    options = {
      cwd: '/test',
      downloadDir: '/test/out',
      logger: new MockedLogger(),
    };

    documentation = {
      versions: [],
    };
    version = {
      id: 'test',
      sources: [{ id: 'test', type: 'git', options: { path: '/tmp/local' } }],
    };
  });

  describe('#new', () => {
    it('should creation a new instance', () => {
      expect(() => new VersionDownloader(options)).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      downloader = new VersionDownloader(options);
    });

    it('should support an empty array of sources', async () => {
      await expect(
        downloader.download({ documentation, version })
      ).resolves.toBeUndefined();
    });

    it('should call the download method of each source', async () => {
      await downloader.download({ documentation, version });
      expect(spySource).toHaveBeenCalledTimes(1);
      expect(spySource).toHaveBeenCalledWith({
        documentation,
        version,
        source: version.sources[0],
      });
    });

    it('should reject when at least one source is rejecting', async () => {
      version.sources[1] = {
        id: 'test',
        type: 'git',
        options: { path: '/tmp/local' },
      };

      spySource.mockClear();
      spySource.mockResolvedValueOnce(undefined);
      spySource.mockRejectedValueOnce('some error');

      await expect(
        downloader.download({ documentation, version })
      ).rejects.toEqual('some error');
    });
  });
});
