import findUp from 'find-up';
import { resolve } from 'path';
import { promises } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import { IDocumentation } from '../models/documentation';
import {
  DocumentationBuilder,
  IDocumentationConfiguration,
} from './documentation/documentation';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  findUp,
};

export class ConfigurationLoader {
  /**
   * Read the YAML configuration file and parse it to return a Documentation object with its context
   * @param options.projectDir the current working directory used as a reference in the context in case of relative paths
   */
  public async load(options: { projectDir: string }): Promise<IDocumentation> {
    const configurationPath = await this.getConfigutationFilePath(options);
    const documentation = await this.readFile(configurationPath);
    const builder = new DocumentationBuilder();

    if (!builder.validate(documentation)) {
      throw new Error('Invalid configuration');
    }

    return builder.build(documentation);
  }

  /**
   * Read and parse the YAML configuration file, or return an empty object when the parsing failed
   * @param path the configuration file path
   */
  private async readFile(path: string): Promise<IDocumentationConfiguration> {
    const data = await promises.readFile(path, { encoding: 'utf-8' });
    try {
      const parsedData = yamlLoad(data, { filename: path });
      return typeof parsedData === 'object'
        ? (parsedData as IDocumentationConfiguration)
        : { versions: {} };
    } catch (e) {
      return { versions: {} };
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
