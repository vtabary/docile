import { MockedLogger } from '../../logger/logger.mock';
import { IBuildContext } from '../build-context/build-context';
import { LocalSource } from '../source/local/local';
import { Version } from './version';

describe('Version', () => {
  let version: Version;
  let options: { logger: MockedLogger; buildContext: IBuildContext };

  beforeEach(() => {
    options = {
      buildContext: {
        cwd: '/test',
        outDir: '/test/out',
        templatesDir: '/test/templates',
        tmpDir: '/test/.tmp',
      },
      logger: new MockedLogger(),
    };
  });

  describe('#new', () => {
    it('should creation a new instance', () => {
      expect(() => new Version({ id: 'test' })).not.toThrow();
    });

    it('should set the id', () => {
      expect(new Version({ id: 'test' }).id).toEqual('test');
    });

    it('should set the label', () => {
      expect(new Version({ id: 'test', label: 'label version' }).label).toEqual(
        'label version'
      );
    });

    it('should set the sources', () => {
      expect(
        new Version({
          id: 'test',
          sources: [
            new LocalSource({ id: 'local-test', path: '/tmp' }, options),
          ],
        }).sources
      ).toEqual([expect.any(LocalSource)]);
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      version = new Version({ id: 'test' });
    });

    it('should support an empty array of sources', async () => {
      await expect(version.download('/test')).resolves.toBeUndefined();
    });

    it('should call the download method of each source', async () => {
      const source = new LocalSource(
        { id: 'test', path: '/tmp/local' },
        options
      );
      jest
        .spyOn(source, 'download')
        .mockImplementation(() => Promise.resolve());
      version.sources = [source];

      await version.download('/test');
      expect(source.download).toHaveBeenCalledWith('/test');
    });

    it('should reject when at least one source is rejecting', async () => {
      const source1 = new LocalSource(
        { id: 'test', path: '/tmp/local' },
        options
      );
      jest
        .spyOn(source1, 'download')
        .mockImplementation(() => Promise.resolve());
      const source2 = new LocalSource(
        { id: 'test', path: '/tmp/local' },
        options
      );
      jest
        .spyOn(source2, 'download')
        .mockImplementation(() => Promise.reject('some error'));

      version.sources = [source1, source2];

      await expect(version.download('/test')).rejects.toEqual('some error');
    });
  });
});
