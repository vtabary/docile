import { ILocalSource } from '../../downloaders/source/local/local';
import * as file from '../../helpers/file/file';
import { MarkdownRenderer } from '../engines/mardown/markdown';
import { TemplateRenderer } from '../template/template';
import { SourceRenderer } from './source';

describe('SourceRenderer', () => {
  let renderer: SourceRenderer;
  let source: ILocalSource;

  beforeEach(() => {
    source = { id: 'test', type: 'local', options: { path: '/tmp/test' } };
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new SourceRenderer()).not.toThrow();
    });
  });

  describe('#generate', () => {
    let spyList: jest.SpyInstance;
    let spyTemplateGenerate: jest.SpyInstance;

    beforeEach(() => {
      spyList = jest
        .spyOn(file, 'listFiles')
        .mockImplementation(async () => [
          '/tmp/test/content1.md',
          '/tmp/test/content2.md',
        ]);
      spyTemplateGenerate = jest
        .spyOn(TemplateRenderer.prototype, 'render')
        .mockImplementation(async () => undefined);
      jest
        .spyOn(MarkdownRenderer.prototype, 'render')
        .mockImplementation(async () => 'markdown rendered');

      renderer = new SourceRenderer();
    });

    it('should throw when something is wrong with one template', async () => {
      spyList.mockReset().mockImplementation(async () => {
        throw new Error('some problem');
      });
      await expect(
        renderer.render(source, {
          documentation: { versions: [] },
          from: '/tmp/from',
          to: '/tmp/to',
          templatesDir: '/tmp/templates',
          version: { id: 'test', sources: [] },
        })
      ).rejects.toThrow();
    });

    it('should process the sources', async () => {
      await renderer.render(source, {
        documentation: { versions: [] },
        from: '/tmp/from',
        to: '/tmp/to',
        templatesDir: '/tmp/templates',
        version: { id: 'test', sources: [] },
      });

      await expect(spyTemplateGenerate).toHaveBeenCalledTimes(2);
    });
  });
});
