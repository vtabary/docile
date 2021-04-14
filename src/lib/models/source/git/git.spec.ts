import simplegit from 'simple-git/promise';
import { MockedLogger } from '../../../logger/logger.mock';
import { GitSource, WRAPPERS } from './git';

describe('GitSource', () => {
  let source: GitSource;
  let logger: MockedLogger;
  let mGit: simplegit.SimpleGit;
  let spyClone: jest.SpyInstance;
  let spyCheckout: jest.SpyInstance;

  beforeEach(() => {
    logger = new MockedLogger();

    mGit = simplegit();
    spyClone = jest.spyOn(mGit, 'clone');
    spyClone.mockImplementation();
    spyCheckout = jest.spyOn(mGit, 'checkout');
    spyCheckout.mockImplementation();

    jest.spyOn(WRAPPERS, 'git').mockImplementation(() => mGit as any);
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(
        () =>
          new GitSource(
            {
              path: 'git@github.com:vtabary/docile.git',
              id: 'test',
            },
            { logger }
          )
      ).not.toThrow();
    });

    it('should set the id', () => {
      source = new GitSource(
        {
          path: 'git@github.com:vtabary/docile.git',
          id: 'test',
        },
        { logger }
      );
      expect(source.id).toEqual('test');
    });

    it('should set the path', () => {
      source = new GitSource(
        {
          path: 'git@github.com:vtabary/docile.git',
          id: 'test',
        },
        { logger }
      );
      expect(source.path).toEqual('git@github.com:vtabary/docile.git');
    });

    it('should set a default branch', () => {
      source = new GitSource(
        {
          path: 'git@github.com:vtabary/docile.git',
          id: 'test',
        },
        { logger }
      );
      expect(source.branch).toEqual('master');
    });

    it('should set the branch', () => {
      source = new GitSource(
        {
          path: 'git@github.com:vtabary/docile.git',
          id: 'test',
          branch: 'main',
        },
        { logger }
      );
      expect(source.branch).toEqual('main');
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      jest.spyOn(logger, 'info').mockReturnValue(undefined);

      source = new GitSource(
        {
          path: 'git@github.com:vtabary/docile.git',
          id: 'test',
        },
        { logger }
      );
    });

    it('should clone the project and checkout the given branch', async () => {
      source.branch = 'some-branch';

      await source.download('/tmp');
      expect(logger.info).toHaveBeenCalledWith(`Cloning files...
  from "git@github.com:vtabary/docile.git"
  to "/tmp/test"`);
      expect(mGit.clone).toHaveBeenCalledWith(
        'git@github.com:vtabary/docile.git',
        '/tmp/test'
      );
      expect(mGit.checkout).toHaveBeenCalledWith('some-branch');
    });

    it('should clone the project and checkout master as the default branch', async () => {
      await source.download('/tmp');
      expect(mGit.checkout).toHaveBeenCalledWith('master');
    });

    it('should throw when the clone can not be done', async () => {
      spyClone.mockImplementation(async () =>
        Promise.reject(new Error('some git error'))
      );
      await expect(source.download('/tmp')).rejects.toThrow('some git error');
    });

    it('should throw when the checkout can not be done', async () => {
      spyCheckout.mockImplementation(async () =>
        Promise.reject(new Error('some git error'))
      );
      await expect(source.download('/tmp')).rejects.toThrow('some git error');
    });
  });
});
