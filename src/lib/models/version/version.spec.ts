import { LocalSource } from '../source/local/local';
import { Version } from './version';

describe('Version', () => {
  let version: Version;

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
          sources: [new LocalSource({ id: 'local-test', path: '/tmp' })],
        }).sources
      ).toEqual([expect.any(LocalSource)]);
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      version = new Version({ id: 'test' });
    });

    it('should support an empty array of sources', async () => {
      expect(version.download('/test')).resolves.toBeUndefined();
    });

    it('should call the download method of each source', async () => {
      const source = new LocalSource({ id: 'test', path: '/tmp/local' });
      jest
        .spyOn(source, 'download')
        .mockImplementation(() => Promise.resolve());
      version.sources = [source];

      await version.download('/test');
      expect(source.download).toHaveBeenCalledWith('/test');
    });

    it('should reject when at least one source is rejecting', async () => {
      const source1 = new LocalSource({ id: 'test', path: '/tmp/local' });
      jest
        .spyOn(source1, 'download')
        .mockImplementation(() => Promise.resolve());
      const source2 = new LocalSource({ id: 'test', path: '/tmp/local' });
      jest
        .spyOn(source2, 'download')
        .mockImplementation(() => Promise.reject('some error'));

      version.sources = [source1, source2];

      expect(version.download('/test')).rejects.toEqual('some error');
    });
  });
});
