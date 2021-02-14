import { ErrorSource } from '../../models/source/error/error';
import { GitSource } from '../../models/source/git/git';
import { HttpSource } from '../../models/source/http/http';
import { LocalSource } from '../../models/source/local/local';
import { SourceBuilder } from './source';

describe('SourceBuilder', () => {
  let builder: SourceBuilder;

  describe('#new', () => {
    it('should create a new instance', () => {
      expect(() => new SourceBuilder()).not.toThrow();
    });
  });

  describe('#build', () => {
    beforeEach(() => {
      builder = new SourceBuilder();
    });

    it('should parse a local source', () => {
      const source = builder.build({
        id: 'test',
        path: '/tmp',
        type: 'local',
      });
      expect(source).toEqual(expect.any(LocalSource));
      expect(source).toEqual(
        expect.objectContaining({
          id: 'test',
          path: '/tmp',
        })
      );
    });

    it('should parse a Git source', () => {
      const source = builder.build({
        id: 'test',
        path: 'git/tmp',
        type: 'git',
      });
      expect(source).toEqual(expect.any(GitSource));
      expect(source).toEqual(
        expect.objectContaining({
          id: 'test',
          path: 'git/tmp',
        })
      );
    });

    it('should parse a HTTP source', () => {
      const source = builder.build({
        id: 'test',
        path: 'http://test',
        type: 'http',
      });
      expect(source).toEqual(expect.any(HttpSource));
      expect(source).toEqual(
        expect.objectContaining({
          id: 'test',
          path: 'http://test',
        })
      );
    });

    it('should return an "error" source by default', () => {
      const source = builder.build({
        id: 'test',
        path: '/tmp',
        type: 'other',
      } as any);
      expect(source).toEqual(expect.any(ErrorSource));
      expect(source).toEqual(
        expect.objectContaining({
          id: 'test',
        })
      );
    });
  });
});
