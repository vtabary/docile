import { Version } from '../version/version';
import { Documentation } from './documentation';

describe('Version', () => {
  let documentation: Documentation;

  describe('#new', () => {
    it('should creation a new instance', () => {
      expect(() => new Documentation({})).not.toThrow();
    });

    it('should set the label', () => {
      expect(new Documentation({ label: 'label documentation' }).label).toEqual(
        'label documentation'
      );
    });

    it('should set the versions', () => {
      expect(
        new Documentation({
          versions: [new Version({ id: 'local-test' })],
        }).versions
      ).toEqual([expect.any(Version)]);
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      documentation = new Documentation({});
    });

    it('should support an empty array of versions', async () => {
      expect(documentation.download('/test')).resolves.toBeUndefined();
    });

    it('should call the download method of each version', async () => {
      const version = new Version({ id: 'test' });
      jest
        .spyOn(version, 'download')
        .mockImplementation(() => Promise.resolve());
      documentation.versions = [version];

      await documentation.download('/test');
      expect(version.download).toHaveBeenCalledWith('/test');
    });

    it('should reject when at least one version is rejecting', async () => {
      const version1 = new Version({ id: 'test' });
      jest
        .spyOn(version1, 'download')
        .mockImplementation(() => Promise.resolve());
      const version2 = new Version({ id: 'test' });
      jest
        .spyOn(version2, 'download')
        .mockImplementation(() => Promise.reject('some error'));

      documentation.versions = [version1, version2];

      expect(documentation.download('/test')).rejects.toEqual('some error');
    });
  });
});
