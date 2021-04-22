import { MockedLogger } from '../../logger/logger.mock';
import { IDocumentation } from '../../models/documentation';
import { VersionDownloader } from '../version/version';
import { DocumentationDownloader } from './documentation';

describe('DocumentationDownloader', () => {
  let downloader: DocumentationDownloader;
  let documentation: IDocumentation;
  let options: { logger: MockedLogger; cwd: string; downloadDir: string };
  let spyRenderer: jest.SpyInstance;

  beforeEach(() => {
    spyRenderer = jest.spyOn(VersionDownloader.prototype, 'download');
    spyRenderer.mockResolvedValue(undefined);

    options = {
      cwd: '/test',
      downloadDir: '/test/out',
      logger: new MockedLogger(),
    };

    documentation = {
      versions: [{ id: 'test', sources: [] }],
    };
  });

  describe('#new', () => {
    it('should creation a new instance', () => {
      expect(() => new DocumentationDownloader(options)).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      downloader = new DocumentationDownloader(options);
    });

    it('should support an empty array of versions', async () => {
      await expect(
        downloader.download({ documentation })
      ).resolves.toBeUndefined();
    });

    it('should call the download method of each version', async () => {
      await downloader.download({ documentation });
      expect(spyRenderer).toHaveBeenCalledTimes(1);
      expect(spyRenderer).toHaveBeenCalledWith({
        documentation,
        version: documentation.versions[0],
      });
    });

    it('should reject when at least one version is rejecting', async () => {
      documentation.versions[1] = { id: 'version2', sources: [] };

      spyRenderer.mockClear();
      spyRenderer.mockResolvedValueOnce(undefined);
      spyRenderer.mockRejectedValueOnce('some error');

      await expect(downloader.download({ documentation })).rejects.toEqual(
        'some error'
      );
    });
  });
});
