import { Logger } from '../logger/logger';
import { ConfigurationLoader } from '../configuration-loader/configuration-loader';
import { DocumentationRenderer } from '../renderers/documentation/documentation';
import { DocumentationDownloader } from '../downloaders/documentation/documentation';
import { IDocumentation } from '../models/documentation';
import { IBuildContext } from '../models/build-context';
import { resolve } from 'path';
import { PluginRegistry } from '../plugin-registry/plugin-registry';
import { ISourceDownloader } from '../downloaders/source/source';
import { ITemplateRenderer } from '../renderers/source/source';
import { RendererHelper } from '../helpers/renderer/renderer';

interface IConfigurationObject {
  documentation: IDocumentation;
  build: IBuildContext;
  plugins: {
    renderers: PluginRegistry<ITemplateRenderer>;
    downloaders: PluginRegistry<ISourceDownloader>;
  };
}

export class DocileCli {
  private logger: Logger;
  private configuration?: IConfigurationObject;

  constructor(options: { logger: Logger }) {
    this.logger = options.logger;
  }

  /**
   * Download the assets from the sources in configuration and generate the documentation
   * @param options.cwd the working directory to consider
   */
  public async generate(options: {
    projectDir: string;
    templates: string;
    outDir?: string;
    tmpDir?: string;
  }): Promise<void> {
    // Parse configuration
    const configuration = await this.loadConfiguration(options);

    // Download the assets
    await this.download(configuration);

    // Generate the documentation
    await new DocumentationRenderer({
      logger: this.logger,
      renderer: new RendererHelper({
        templatesDir: configuration.build.templatesDir,
        renderers: configuration.plugins.renderers,
        baseUrl: '/',
      }),
    }).render(configuration.documentation, {
      from: configuration.build.tmpDir,
      to: configuration.build.outDir,
    });
  }

  /**
   * Download all the assets from the sources
   * @param options.cwd the working directory to consider
   */
  private async download(configuration: IConfigurationObject): Promise<void> {
    // Download the assets
    await new DocumentationDownloader({
      cwd: configuration.build.cwd,
      downloadDir: configuration.build.tmpDir,
      logger: this.logger,
      downloaders: configuration.plugins.downloaders,
    }).download({ documentation: configuration.documentation });
  }

  /**
   * Parse the given configuration
   * @param options.cwd the working directory to consider
   * @returns the parsed configuration
   */
  private async loadConfiguration(options: {
    projectDir: string;
    templates: string;
    outDir?: string;
    tmpDir?: string;
  }): Promise<IConfigurationObject> {
    if (this.configuration) {
      return this.configuration;
    }

    const tmpDir = resolve(options.tmpDir || '.tmp');

    const configuration = await new ConfigurationLoader({
      logger: this.logger,
    }).load({
      downloadDir: tmpDir,
      projectDir: options.projectDir,
    });

    return (this.configuration = {
      ...configuration,
      build: {
        cwd: options.projectDir,
        outDir: resolve(options.outDir || 'public'),
        templatesDir: resolve(options.templates),
        tmpDir,
      },
    });
  }
}
