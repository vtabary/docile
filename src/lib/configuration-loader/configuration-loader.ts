import findUp from 'find-up';
import { resolve } from 'path';
import { promises } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import { IDocumentation } from '../models/documentation';
import {
  DocumentationBuilder,
  IDocumentationConfiguration,
} from './documentation/documentation';
import { PluginRegistry } from '../plugin-registry/plugin-registry';
import { ITemplateRenderer } from '../renderers/source/source';
import { ISourceDownloader } from '../downloaders/source/source';
import { PluginsBuilder } from './plugins/plugins';
import { Logger } from '../logger/logger';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  findUp,
};

export interface IConfiguration {
  documentation: IDocumentationConfiguration;
  plugins?: string[];
}

export class ConfigurationLoader {
  constructor(private options: { logger: Logger }) {}

  /**
   * Read the YAML configuration file and parse it to return a Documentation object with its context
   * @param options.projectDir the current working directory used as a reference in the context in case of relative paths
   */
  public async load(options: {
    projectDir: string;
    downloadDir: string;
  }): Promise<{
    documentation: IDocumentation;
    plugins: {
      renderers: PluginRegistry<ITemplateRenderer>;
      downloaders: PluginRegistry<ISourceDownloader>;
    };
  }> {
    const configurationPath = await this.getConfigutationFilePath(options);
    const configuration = await this.readFile(configurationPath);
    const documentationBuilder = new DocumentationBuilder();

    if (!documentationBuilder.validate(configuration.documentation)) {
      throw new Error('Invalid configuration');
    }

    return {
      documentation: documentationBuilder.build(configuration.documentation),
      plugins: await new PluginsBuilder().build(configuration.plugins || [], {
        cwd: options.projectDir,
        downloadDir: options.downloadDir,
        logger: this.options.logger,
      }),
    };
  }

  /**
   * Read and parse the YAML configuration file, or return an empty object when the parsing failed
   * @param path the configuration file path
   */
  private async readFile(path: string): Promise<IConfiguration> {
    const data = await promises.readFile(path, { encoding: 'utf-8' });
    try {
      const parsedData = yamlLoad(data, { filename: path });
      return typeof parsedData === 'object'
        ? (parsedData as IConfiguration)
        : { documentation: { versions: {} } };
    } catch (e) {
      return { documentation: { versions: {} } };
    }
  }

  /**
   * Try to find the first configuration file from the current working directory
   * Try with the current directory or look for it in the parent directories when missing
   * It throws when no file can been found
   * @param options.cwd the directory in which we should start the search for a configuraiton file. Default: process.cwd()
   */
  private async getConfigutationFilePath(options: {
    projectDir: string;
  }): Promise<string> {
    const filePath = await WRAPPERS.findUp('.docile.yml', {
      cwd: resolve(options.projectDir),
    });

    if (!filePath) {
      throw new Error('No configuration file found.');
    }

    return filePath;
  }
}
