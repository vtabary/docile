import { IBuildContext } from '../../models/build-context/build-context';
import { Documentation } from '../../models/documentation/documentation';
import { DocumentationBuilder } from './documentation';

describe('DocumentationBuilder', () => {
  let builder: DocumentationBuilder;
  let context: IBuildContext;

  beforeEach(() => {
    context = {
      cwd: '/test',
      outDir: '/test/out',
      templatesDir: '/test/templates',
      tmpDir: '/test/.tmp',
    };
  });

  describe('#new', () => {
    it('should create a new instance', () => {
      expect(() => new DocumentationBuilder(context)).not.toThrow();
    });
  });

  describe('#build', () => {
    beforeEach(() => {
      builder = new DocumentationBuilder(context);
    });

    it('should return a Documentation object', () => {
      const documentation = builder.build({ label: 'test', versions: {} });
      expect(documentation).toEqual(expect.any(Documentation));
      expect(documentation).toEqual(
        expect.objectContaining({
          label: 'test',
          versions: [],
        })
      );
    });

    it('should set the versions', () => {
      const documentation = builder.build({
        versions: { test: { sources: {} } },
      });
      expect(documentation).toEqual(
        expect.objectContaining({
          versions: [expect.objectContaining({ id: 'test', sources: [] })],
        })
      );
    });
  });
});