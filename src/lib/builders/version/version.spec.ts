import { IVersionConfiguration, VersionBuilder } from './version';

describe('VersionBuilder', () => {
  let builder: VersionBuilder;
  let config: IVersionConfiguration;

  beforeEach(() => {
    config = {
      sources: {
        test: {
          type: 'test',
          options: {},
        },
      },
      label: 'test',
    };
  });

  describe('#new', () => {
    it('should create a new instance', () => {
      expect(() => new VersionBuilder()).not.toThrow();
    });
  });

  describe('#build', () => {
    beforeEach(() => {
      builder = new VersionBuilder();
    });

    it('should return a Version object', () => {
      const version = builder.build('test', config);
      expect(version).toEqual({
        id: 'test',
        label: 'test',
        sources: [
          {
            id: 'test',
            type: 'test',
            options: {},
          },
        ],
      });
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      builder = new VersionBuilder();
    });

    it('should return true for a configuration without label', () => {
      delete (config as any).label;
      const valid = builder.validate(config);
      expect(valid).toBe(true);
    });

    it('should return false for a configuration without sources', () => {
      config.sources = {};
      const valid = builder.validate(config);
      expect(valid).toBe(false);
    });

    it('should return true for a valid configuration', () => {
      const valid = builder.validate(config);
      expect(valid).toBe(true);
    });
  });
});
