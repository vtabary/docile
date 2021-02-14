import { promises } from 'fs';
import { load } from 'js-yaml';
import { resolve, dirname } from 'path';
import findUp from 'find-up';
import { Documentation } from '../models/documentation/documentation';
import { IBuildContext } from '../models/build-context/build-context';
import {
  DocumentationBuilder,
  IDocumentationConfiguration,
} from '../builders/documentation/documentation';

export interface IConfiguration {
  documentation: IDocumentationConfiguration;
  build: IBuildContextObject;
}

export interface IBuildContextObject {
  outDir?: string;
  tmpDir?: string;
  templatesDir?: string;
}

export class Configurationloader {
  public async load(
    options: { cwd?: string } = {}
  ): Promise<{ documentation: Documentation; build: IBuildContext }> {
    const configurationPath = await this.getConfigutationFilePath(options);
    const data = await this.readFile(configurationPath);

    return {
      documentation: this.parseDocumentation(data?.documentation),
      build: this.parseBuildContext(data?.build, configurationPath),
    };
  }

  private async readFile(path: string): Promise<IConfiguration | null> {
    const data = await promises.readFile(path, { encoding: 'utf-8' });
    const parsedData = load(data, { filename: path });
    return typeof parsedData === 'object'
      ? (parsedData as IConfiguration)
      : null;
  }

  private async getConfigutationFilePath(
    options: { cwd?: string } = {}
  ): Promise<string> {
    const filePath = await findUp('.docile.yml', {
      cwd: options.cwd ? resolve(options.cwd) : process.cwd(),
    });

    if (!filePath) {
      throw new Error('No configuration file found.');
    }

    return filePath;
  }

  private parseDocumentation(
    data: IDocumentationConfiguration = { versions: {} }
  ): Documentation {
    return new DocumentationBuilder().build(data);
  }

  private parseBuildContext(
    data: IBuildContextObject = {},
    configurationPath: string
  ): IBuildContext {
    const projectPath = dirname(configurationPath);
    return {
      outDir: this.resolveOutDir(data.outDir, { projectPath }),
      tmpDir: this.resolveTmpDir(data.tmpDir, { projectPath }),
      templatesDir: this.resolveTemplatesDir(data.templatesDir, {
        projectPath,
      }),
    };
  }

  private resolveTemplatesDir(
    givenDir: string | undefined,
    options: { projectPath: string }
  ): string {
    if (!givenDir) {
      return resolve(__dirname, '../../../../templates');
    }

    // TODO: support templates from other libraries using require.resolve
    return resolve(options.projectPath, givenDir);
  }

  private resolveOutDir(
    givenDir: string | undefined,
    options: { projectPath: string }
  ): string {
    if (!givenDir) {
      return resolve('public/docs');
    }

    return resolve(options.projectPath, givenDir);
  }

  private resolveTmpDir(
    givenDir: string | undefined,
    options: { projectPath: string }
  ): string {
    if (!givenDir) {
      return resolve('.tmp');
    }

    return resolve(options.projectPath, givenDir);
  }
}
