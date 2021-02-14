import { GitSource } from './git';

const mGit = {
  checkout: jest.fn(),
  clone: jest.fn(),
};

jest.mock('simple-git/promise', () => {
  return jest.fn(() => mGit);
});

describe('GitSource', () => {
  let source: GitSource;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(
        () =>
          new GitSource({
            path: 'git@github.com:vtabary/docile.git',
            id: 'test',
          })
      ).not.toThrow();
    });

    it('should set the id', () => {
      source = new GitSource({
        path: 'git@github.com:vtabary/docile.git',
        id: 'test',
      });
      expect(source.id).toEqual('test');
    });

    it('should set the path', () => {
      source = new GitSource({
        path: 'git@github.com:vtabary/docile.git',
        id: 'test',
      });
      expect(source.path).toEqual('git@github.com:vtabary/docile.git');
    });

    it('should set a default branch', () => {
      source = new GitSource({
        path: 'git@github.com:vtabary/docile.git',
        id: 'test',
      });
      expect(source.branch).toEqual('master');
    });

    it('should set the branch', () => {
      source = new GitSource({
        path: 'git@github.com:vtabary/docile.git',
        id: 'test',
        branch: 'main',
      });
      expect(source.branch).toEqual('main');
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      mGit.checkout.mockReset();
      mGit.clone.mockReset();

      spyOn(console, 'log').and.stub();
      source = new GitSource({
        path: 'git@github.com:vtabary/docile.git',
        id: 'test',
      });
    });

    it('should clone the project and checkout the given branch', async () => {
      source.branch = 'some-branch';

      await source.download('/tmp');
      expect(console.log).toHaveBeenCalledWith(`Cloning files...
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
      mGit.clone.mockImplementation(async () =>
        Promise.reject(new Error('some git error'))
      );
      await expect(source.download('/tmp')).rejects.toThrow('some git error');
    });

    it('should throw when the checkout can not be done', async () => {
      mGit.checkout.mockImplementation(async () =>
        Promise.reject(new Error('some git error'))
      );
      await expect(source.download('/tmp')).rejects.toThrow('some git error');
    });
  });
});
