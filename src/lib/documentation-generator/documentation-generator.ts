import { resolve } from 'path';
import { Documentation } from '../models/documentation/documentation';
import { copyFiles } from '../helpers/file/file';
import { VersionGenerator } from './version-generator/version-generator';
import { TemplateGenerator } from './template-generator/template-generator';

export class DocumentationGenerator {
  public generate(
    documentation: Documentation,
    options: {
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    console.log(
      `Compiling from "${options.from}" to "${options.to}" using templates in "${options.templatesDir}"...`
    );

    return this.generateFiles(documentation, options).then(() =>
      this.copyAssets(options)
    );
  }

  private async generateFiles(
    documentation: Documentation,
    options: {
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    await Promise.all([
      new TemplateGenerator().generate(
        resolve(options.templatesDir, 'index.html'),
        options.to,
        { data: { documentation } }
      ),
      ...documentation.versions.map((version) =>
        new VersionGenerator().generate(version, {
          from: options.from,
          documentation: documentation,
          templatesDir: options.templatesDir,
          to: options.to,
        })
      ),
    ]);
  }

  private copyAssets(options: {
    from: string;
    to: string;
    templatesDir: string;
  }): Promise<void> {
    return copyFiles(
      options.templatesDir,
      [
        '**/*.css',
        '**/*.png',
        '**/*.jpg',
        '**/*.gif',
        '**/*.svg',
        '**/*.ttf',
        '**/*.eof',
        '**/*.woff',
      ],
      options.to
    );
  }
}
