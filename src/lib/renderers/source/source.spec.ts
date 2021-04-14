import * as file from '../../helpers/file/file';
import { MockedLogger } from '../../logger/logger.mock';
import { Documentation } from '../../models/documentation/documentation';
import { LocalSource } from '../../models/source/local/local';
import { Version } from '../../models/version/version';
import { MarkdownRenderer } from '../engines/mardown/markdown';
import { TemplateRenderer } from '../template/template';
import { SourceRenderer } from './source';

describe('SourceRenderer', () => {
  let renderer: SourceRenderer;
  let source: LocalSource;

  beforeEach(() => {
    source = new LocalSource(
      { id: 'test', path: '/tmp/test' },
      {
        logger: new MockedLogger(),
        buildContext: {
          cwd: '/some',
          outDir: '/some/out',
          templatesDir: '/some/templates',
          tmpDir: 'some/.tmp',
        },
      }
    );
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
          documentation: new Documentation({}),
          from: '/tmp/from',
          to: '/tmp/to',
          templatesDir: '/tmp/templates',
          version: new Version({ id: 'test' }),
        })
      ).rejects.toThrow();
    });

    it('should process the sources', async () => {
      await renderer.render(source, {
        documentation: new Documentation({}),
        from: '/tmp/from',
        to: '/tmp/to',
        templatesDir: '/tmp/templates',
        version: new Version({ id: 'test' }),
      });

      await expect(spyTemplateGenerate).toHaveBeenCalledTimes(2);
    });
  });
});
