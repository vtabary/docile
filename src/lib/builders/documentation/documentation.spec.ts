import {
  DocumentationBuilder,
  IDocumentationConfiguration,
} from './documentation';

describe('DocumentationBuilder', () => {
  let builder: DocumentationBuilder;
  let config: IDocumentationConfiguration;

  beforeEach(() => {
    config = {
      label: 'test',
      versions: {
        test: {
          sources: {
            test: {
              type: 'test',
              options: {},
            },
          },
        },
      },
    };
  });

  describe('#new', () => {
    it('should create a new instance', () => {
      expect(() => new DocumentationBuilder()).not.toThrow();
    });
  });

  describe('#build', () => {
    beforeEach(() => {
      builder = new DocumentationBuilder();
    });

    it('should return a Documentation object', () => {
      const documentation = builder.build(config);
      expect(documentation).toEqual({
        label: 'test',
        versions: [
          {
            id: 'test',
            sources: [
              {
                id: 'test',
                type: 'test',
                options: {},
              },
            ],
          },
        ],
      });
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      builder = new DocumentationBuilder();
    });

    it('should return true when the documentation has no label', () => {
      delete config.label;
      expect(builder.validate(config)).toBe(true);
    });

    it('should return true when the documentation has no label', () => {
      delete (config as any).versions;
      expect(builder.validate(config)).toBe(false);
    });

    it('should return true when the documentation has no label', () => {
      delete config.label;
      expect(builder.validate(config)).toBe(true);
    });
  });
});
