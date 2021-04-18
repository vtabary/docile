import { MockedLogger } from '../../logger/logger.mock';
import { Documentation } from '../../models/documentation/documentation';
import { LocalSource } from '../../models/source/local/local';
import { Version } from '../../models/version/version';
import { SourceRenderer } from '../source/source';
import { TemplateRenderer } from '../template/template';
import { VersionRenderer } from './version';

describe('VersionRenderer', () => {
  let renderer: VersionRenderer;
  let documentation: Documentation;
  let version: Version;
  let spySourceRender: jest.SpyInstance;
  let spyTemplateRenderer: jest.SpyInstance;

  beforeEach(() => {
    spyTemplateRenderer = jest.spyOn(TemplateRenderer.prototype, 'render');
    spyTemplateRenderer.mockImplementation(async () => undefined);
    spySourceRender = jest.spyOn(SourceRenderer.prototype, 'render');
    spySourceRender.mockImplementation(async () => undefined);

    version = new Version({
      id: 'test',
      sources: [
        new LocalSource(
          {
            id: 'local',
            path: '/test',
          },
          {
            buildContext: {
              cwd: '/test',
              outDir: '/test/out',
              templatesDir: '/test/templates',
              tmpDir: '/test/.tmp',
            },
            logger: new MockedLogger(),
          }
        ),
      ],
    });

    documentation = new Documentation({
      label: 'test',
      versions: [version],
    });
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new VersionRenderer()).not.toThrow();
    });
  });

  describe('#render', () => {
    beforeEach(() => {
      renderer = new VersionRenderer();
    });

    it('should generate the version file', async () => {
      await renderer.render(version, {
        from: '/from',
        templatesDir: '/some/templates',
        to: '/to',
        documentation,
      });

      expect(TemplateRenderer.prototype.render).toHaveBeenCalledWith(
        '/some/templates/version.html',
        '/to/test',
        {
          data: { documentation, version },
          fileName: 'index.html',
        }
      );
    });

    it('should render each source', async () => {
      await renderer.render(version, {
        from: '/from',
        templatesDir: '/some/templates',
        to: '/to',
        documentation,
      });

      expect(spySourceRender).toHaveBeenCalledTimes(1);
      expect(spySourceRender).toHaveBeenCalledWith(version.sources[0], {
        documentation,
        version,
        from: '/from/test',
        to: '/to/test',
        templatesDir: '/some/templates',
      });
    });

    it('should not render the source when empty', async () => {
      version.sources = [];
      await renderer.render(version, {
        from: '/from',
        templatesDir: '/some/templates',
        to: '/to',
        documentation,
      });

      expect(spyTemplateRenderer).toHaveBeenCalled();
      expect(spySourceRender).not.toHaveBeenCalled();
    });

    it('should throw when a source renderer is throwing', async () => {
      spySourceRender.mockRejectedValue('some problem');

      await expect(
        renderer.render(version, {
          from: '/from',
          templatesDir: '/some/templates',
          to: '/to',
          documentation,
        })
      ).rejects.toEqual('some problem');
    });

    it('should throw when the template renderer is throwing', async () => {
      spyTemplateRenderer.mockRejectedValue('some problem');

      await expect(
        renderer.render(version, {
          from: '/from',
          templatesDir: '/some/templates',
          to: '/to',
          documentation,
        })
      ).rejects.toEqual('some problem');
    });
  });
});
