import { Documentation } from '../../models/documentation/documentation';
import { DocumentationBuilder } from './documentation';

describe('DocumentationBuilder', () => {
  let builder: DocumentationBuilder;

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
