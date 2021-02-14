import { basename, resolve } from 'path';
import { ISource } from '../../models/source/source';
import { Documentation } from '../../models/documentation/documentation';
import { Version } from '../../models/version/version';
import { listFiles } from '../../helpers/file/file';
import { MarkdownGenerator } from '../mardown-generator/markdown-generator';
import { TemplateGenerator } from '../template-generator/template-generator';

export class SourceGenerator {
  public async generate(
    source: ISource,
    options: {
      documentation: Documentation;
      version: Version;
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
        this.generateFile(md, {
          documentation: options.documentation,
          version: options.version,
          templatesDir: options.templatesDir,
          to: toDir,
          from: fromDir,
        })
      )
    );
  }

  private generateFile(
    filePath: string,
    options: {
      documentation: Documentation;
      version: Version;
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    return new MarkdownGenerator()
      .generate(filePath, {
        baseUrl: '/',
      })
      .then((markdown) =>
        new TemplateGenerator().generate(
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
