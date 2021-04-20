import { MockedLogger } from '../../logger/logger.mock';
import { IDocumentation } from '../../models/documentation';
import { TemplateRenderer } from '../template/template';
import { VersionRenderer } from '../version/version';
import { DocumentationRenderer, WRAPPERS } from './documentation';

describe('DocumentationRenderer', () => {
  let renderer: DocumentationRenderer;
  let documentation: IDocumentation;
  let spyVersionRender: jest.SpyInstance;
  let spyTemplateRender: jest.SpyInstance;
  let spyCopy: jest.SpyInstance;
  let logger: MockedLogger;

  beforeEach(() => {
    spyTemplateRender = jest.spyOn(TemplateRenderer.prototype, 'render');
    spyTemplateRender.mockImplementation(async () => undefined);
    spyVersionRender = jest.spyOn(VersionRenderer.prototype, 'render');
    spyVersionRender.mockImplementation(async () => undefined);
    spyCopy = jest.spyOn(WRAPPERS, 'copyFiles');
    spyCopy.mockImplementation(async () => undefined);

    documentation = {
      label: 'test',
      versions: [{ id: 'test1', sources: [] }],
    };

    logger = new MockedLogger();
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new DocumentationRenderer({ logger })).not.toThrow();
    });
  });

  describe('#render', () => {
    beforeEach(() => {
      renderer = new DocumentationRenderer({ logger });
    });

    it('should generate the index file', async () => {
      await renderer.render(documentation, {
        from: '/from',
        templatesDir: '/some/templates',
        to: '/to',
      });

      expect(TemplateRenderer.prototype.render).toHaveBeenCalledWith(
        '/some/templates/index.html',
        '/to',
        {
          data: { documentation },
        }
      );
    });

    it('should copy all asset files from the templates', async () => {
      await renderer.render(documentation, {
        from: '/from',
        templatesDir: '/some/templates',
        to: '/to',
      });

      expect(WRAPPERS.copyFiles).toHaveBeenCalledWith(
        '/some/templates',
        [
          '**/*.css',
          '**/*.png',
          '**/*.jpg',
          '**/*.gif',
          '**/*.svg',
          '**/*.ttf',
          '**/*.eof',
          '**/*.woff',
        ],
        '/to'
      );
    });

    it('should render each version', async () => {
      await renderer.render(documentation, {
        from: '/from',
        templatesDir: '/some/templates',
        to: '/to',
      });

      expect(spyVersionRender).toHaveBeenCalledTimes(1);
      expect(spyVersionRender).toHaveBeenCalledWith(documentation.versions[0], {
        documentation,
        from: '/from',
        to: '/to',
        templatesDir: '/some/templates',
      });
    });

    it('should not render the version when empty', async () => {
      documentation.versions = [];
      await renderer.render(documentation, {
        from: '/from',
        templatesDir: '/some/templates',
        to: '/to',
      });

      expect(spyTemplateRender).toHaveBeenCalled();
      expect(spyVersionRender).not.toHaveBeenCalled();
    });

    it('should throw when a version renderer is throwing', async () => {
      spyVersionRender.mockRejectedValue('some problem');

      await expect(
        renderer.render(documentation, {
          from: '/from',
          templatesDir: '/some/templates',
          to: '/to',
        })
      ).rejects.toEqual('some problem');
    });

    it('should throw when the template renderer is throwing', async () => {
      spyTemplateRender.mockRejectedValue('some problem');

      await expect(
        renderer.render(documentation, {
          from: '/from',
          templatesDir: '/some/templates',
          to: '/to',
        })
      ).rejects.toEqual('some problem');
    });

    it('should throw when the asset copy is throwing', async () => {
      spyCopy.mockRejectedValue('some problem');

      await expect(
        renderer.render(documentation, {
          from: '/from',
          templatesDir: '/some/templates',
          to: '/to',
        })
      ).rejects.toEqual('some problem');
    });
  });
});
