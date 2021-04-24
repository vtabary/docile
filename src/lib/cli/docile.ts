import { Logger } from '../logger/logger';
import { ConfigurationLoader } from '../configuration-loader/configuration-loader';
import { DocumentationRenderer } from '../renderers/documentation/documentation';
import { DocumentationDownloader } from '../downloaders/documentation/documentation';
import { IDocumentation } from '../models/documentation';
import { IBuildContext } from '../models/build-context';
import { resolve } from 'path';

export class DocileCli {
  private logger: Logger;
  private configuration?: {
    documentation: IDocumentation;
    build: IBuildContext;
  };

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
    await new DocumentationRenderer({ logger: this.logger }).render(
      configuration.documentation,
      {
        from: configuration.build.tmpDir,
        to: configuration.build.outDir,
        templatesDir: configuration.build.templatesDir,
      }
    );
  }

  /**
   * Download all the assets from the sources
   * @param options.cwd the working directory to consider
   */
  private async download(configuration: {
    documentation: IDocumentation;
    build: IBuildContext;
  }): Promise<void> {
    // Download the assets
    await new DocumentationDownloader({
      cwd: configuration.build.cwd,
      downloadDir: configuration.build.tmpDir,
      logger: this.logger,
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
  }): Promise<{ documentation: IDocumentation; build: IBuildContext }> {
    if (!this.configuration) {
      this.configuration = {
        documentation: await new ConfigurationLoader().load(options),
        build: {
          cwd: options.projectDir,
          outDir: resolve(options.outDir || 'public'),
          templatesDir: resolve(options.templates),
          tmpDir: resolve(options.tmpDir || '.tmp'),
        },
      };
    }

    return this.configuration;
  }
}
