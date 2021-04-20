import { basename, resolve } from 'path';
import { listFiles } from '../../helpers/file/file';
import { IDocumentation } from '../../models/documentation';
import { ISource } from '../../models/source';
import { IVersion } from '../../models/version';
import { MarkdownRenderer } from '../engines/mardown/markdown';
import { TemplateRenderer } from '../template/template';

export class SourceRenderer {
  public async render(
    source: ISource,
    options: {
      documentation: IDocumentation;
      version: IVersion;
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    const toDir = resolve(options.to, source.id);
    const fromDir = resolve(options.from, source.id);
    const mdFiles = await listFiles(fromDir, ['*.md']);

    await Promise.all(
      mdFiles.map((md) =>
        this.renderFile(md, {
          documentation: options.documentation,
          version: options.version,
          templatesDir: options.templatesDir,
          to: toDir,
          from: fromDir,
        })
      )
    );
  }

  private renderFile(
    filePath: string,
    options: {
      documentation: IDocumentation;
      version: IVersion;
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    return new MarkdownRenderer()
      .render(filePath, {
        baseUrl: '/',
      })
      .then((markdown) =>
        new TemplateRenderer().render(
          resolve(options.templatesDir, 'page.html'),
          options.to,
          {
            data: {
              documentation: options.documentation,
              content: markdown,
            },
            fileName: basename(filePath, '.md') + '.html',
          }
        )
      );
  }
}
