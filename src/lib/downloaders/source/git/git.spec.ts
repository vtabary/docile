import simplegit, { SimpleGit } from 'simple-git';
import { MockedLogger } from '../../../logger/logger.mock';
import { IDocumentation } from '../../../models/documentation';
import { IVersion } from '../../../models/version';
import { GitSourceDownloader, IGitSource, WRAPPERS } from './git';

describe('GitSourceDownloader', () => {
  let downloader: GitSourceDownloader;
  let documentation: IDocumentation;
  let version: IVersion;
  let source: IGitSource;
  let options: { logger: MockedLogger; cwd: string; downloadDir: string };
  let mGit: SimpleGit;
  let spyClone: jest.SpyInstance;
  let spyCheckout: jest.SpyInstance;

  beforeEach(() => {
    mGit = simplegit();
    spyClone = jest.spyOn(mGit, 'clone');
    spyClone.mockImplementation();
    spyCheckout = jest.spyOn(mGit, 'checkout');
    spyCheckout.mockImplementation();

    jest.spyOn(WRAPPERS, 'git').mockImplementation(() => mGit);

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
      type: 'git',
      options: {
        url: 'git@github.com:vtabary/docile.git',
      },
    };
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new GitSourceDownloader(options)).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      jest.spyOn(options.logger, 'info').mockReturnValue(undefined);

      downloader = new GitSourceDownloader(options);
    });

    it('should clone the project and checkout the given branch', async () => {
      source.options.branch = 'some-branch';

      await downloader.download({ documentation, version, source });
      expect(options.logger.info).toHaveBeenCalledWith(`Cloning files...
  from "git@github.com:vtabary/docile.git"
  to "/some/.tmp/test-version/test-source"`);
      expect(mGit.clone).toHaveBeenCalledWith(
        'git@github.com:vtabary/docile.git',
        '/some/.tmp/test-version/test-source'
      );
      expect(mGit.checkout).toHaveBeenCalledWith('some-branch');
    });

    it('should clone the project and checkout master as the default branch', async () => {
      await downloader.download({ documentation, version, source });
      expect(mGit.checkout).toHaveBeenCalledWith('master');
    });

    it('should throw when the clone can not be done', async () => {
      spyClone.mockImplementation(async () =>
        Promise.reject(new Error('some git error'))
      );
      await expect(
        downloader.download({ documentation, version, source })
      ).rejects.toThrow('some git error');
    });

    it('should throw when the checkout can not be done', async () => {
      spyCheckout.mockImplementation(async () =>
        Promise.reject(new Error('some git error'))
      );
      await expect(
        downloader.download({ documentation, version, source })
      ).rejects.toThrow('some git error');
    });
  });
});
