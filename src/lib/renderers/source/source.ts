import { basename, resolve } from 'path';
import { listFiles, readFile, writeFile } from '../../helpers/file/file';
import { RendererHelper } from '../../helpers/renderer/renderer';
import { Logger } from '../../logger/logger';
import { IDocumentation } from '../../models/documentation';
import { ISource } from '../../models/source';
import { IVersion } from '../../models/version';
import { MissingRenderer } from './error/error';

export interface ITemplateRenderer {
  render(
    content: string,
    options: {
      baseUrl: string;
      data?: { [key: string]: unknown };
    }
  ): Promise<string>;
}

export class SourceRenderer {
  private defaultRenderer = new MissingRenderer(this.options);

  constructor(
    private options: {
      renderer: RendererHelper;
      logger: Logger;
    }
  ) {}

  public async render(
    source: ISource,
    options: {
      documentation: IDocumentation;
      version: IVersion;
      from: string;
      to: string;
      baseUrl: string;
    }
  ): Promise<void> {
    const toDir = resolve(options.to, source.id);
    const fromDir = resolve(options.from, source.id);
    const mdFiles = await listFiles(
      fromDir,
      this.options.renderer.getExtensions().map((key) => `*.${key}`)
    );

    await Promise.all(
      mdFiles.map((md) =>
        this.renderFile(md, {
          documentation: options.documentation,
          version: options.version,
          templateDir: options.templateDir,
          to: toDir,
          from: fromDir,
          baseUrl: options.baseUrl,
        })
      )
    );
  }

  private async renderFile(
    filePath: string,
    options: {
      documentation: IDocumentation;
      version: IVersion;
      from: string;
      to: string;
      templateDir: string;
      baseUrl: string;
    }
  ): Promise<void> {
    const docContent = await this.findRendererFor(filePath).render(
      await readFile(filePath),
      {
        baseUrl: '/',
        templateDir: options.templateDir,
      }
    );

    const pageContent = await this.findRendererFor('page.html').render(
      await readFile(resolve(options.templateDir, 'page.html')),
      {
        data: {
          documentation: options.documentation,
          content: docContent,
        },
        baseUrl: '/',
        templateDir: options.templateDir,
      }
    );

    await writeFile(options.to, pageContent);
  }

  private findRendererFor(filepath: string): ITemplateRenderer {
    return (
      this.options.renderers.get(basename(filepath)) || this.defaultRenderer
    );
  }
}
