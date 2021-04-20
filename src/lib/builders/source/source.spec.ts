import { ISourceConfiguration, SourceBuilder } from './source';

describe('SourceBuilder', () => {
  let builder: SourceBuilder;
  let config: ISourceConfiguration<{ path: string }, 'test'>;

  beforeEach(() => {
    config = {
      type: 'test',
      options: {
        path: '/some/dir',
      },
    };
  });

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
      const source = builder.build('test', config);
      expect(source).toEqual({
        id: 'test',
        type: 'test',
        options: {
          path: '/some/dir',
        },
      });
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      builder = new SourceBuilder();
    });

    it('should return false when the configuration is invalid', () => {
      delete (config as any).options;
      const valid = builder.validate(config);
      expect(valid).toBe(false);
    });

    it('should return true when the configuration is valid', () => {
      const valid = builder.validate(config);
      expect(valid).toBe(true);
    });
  });
});
