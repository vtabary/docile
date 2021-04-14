import findUp from 'find-up';
import { dirname, resolve } from 'path';
import { promises } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import { Documentation } from '../models/documentation/documentation';
import { IBuildContext } from '../models/build-context/build-context';
import { ContextBuilder } from '../builders/context/context';
import {
  DocumentationBuilder,
  IDocumentationConfiguration,
} from '../builders/documentation/documentation';
import { Logger } from '../logger/logger';

export interface IConfigurationFile {
  documentation?: IDocumentationConfiguration;
  build?: {
    outDir?: string;
  };
}

export interface IConfiguration {
  documentation: Documentation;
  build: IBuildContext;
}

/**
 * For test purpose only
 */
export const WRAPPERS = {
  findUp,
};

export class Configurationloader {
  private logger: Logger;

  constructor(options: { logger: Logger }) {
    this.logger = options.logger;
  }

  /**
   * Read the YAML configuration file and parse it to return a Documentation object with its context
   * @param options.cwd the current working directory used as a reference in the context in case of relative paths
   */
  public async load(options?: { cwd?: string }): Promise<IConfiguration> {
    const configurationPath = await this.getConfigutationFilePath(options);
    const configuration = await this.readFile(configurationPath);
    const buildContext = await new ContextBuilder().build(configuration.build, {
      cwd: dirname(configurationPath),
    });

    return {
      documentation: new DocumentationBuilder(buildContext, {
        logger: this.logger,
      }).build(configuration.documentation),
      build: buildContext,
    };
  }

  /**
   * Read and parse the YAML configuration file, or return an empty object when the parsing failed
   * @param path the configuration file path
   */
  private async readFile(path: string): Promise<IConfigurationFile> {
    const data = await promises.readFile(path, { encoding: 'utf-8' });
    try {
      const parsedData = yamlLoad(data, { filename: path });
      return typeof parsedData === 'object'
        ? (parsedData as IConfigurationFile)
        : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Try to find the first configuration file from the current working directory
   * Try with the current directory or look for it in the parent directories when missing
   * It throws when no file can been found
   * @param options.cwd the directory in which we should start the search for a configuraiton file. Default: process.cwd()
   */
  private async getConfigutationFilePath(
    options: { cwd?: string } = {}
  ): Promise<string> {
    const filePath = await WRAPPERS.findUp('.docile.yml', {
      cwd: options.cwd ? resolve(options.cwd) : process.cwd(),
    });

    if (!filePath) {
      throw new Error('No configuration file found.');
    }

    return filePath;
  }
}
