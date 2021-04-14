import { resolve } from 'path';
import { Documentation } from '../../models/documentation/documentation';
import { copyFiles } from '../../helpers/file/file';
import { VersionRenderer } from '../version/version';
import { TemplateRenderer } from '../template/template';
import { Logger } from '../../logger/logger';

/**
 * For test purposes only
 */
export const WRAPPERS = {
  copyFiles,
};

export class DocumentationRenderer {
  private logger: Logger;

  constructor(options: { logger: Logger }) {
    this.logger = options.logger;
  }

  public async render(
    documentation: Documentation,
    options: {
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    this.logger.info(
      `Compiling from "${options.from}" to "${options.to}" using templates in "${options.templatesDir}"...`
    );

    await this.renderFiles(documentation, options);
    await this.copyAssets(options);
  }

  private async renderFiles(
    documentation: Documentation,
    options: {
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    const versionRenderer = new VersionRenderer();
    await Promise.all([
      new TemplateRenderer().render(
        resolve(options.templatesDir, 'index.html'),
        options.to,
        { data: { documentation } }
      ),
      ...documentation.versions.map((version) =>
        versionRenderer.render(version, {
          from: options.from,
          documentation: documentation,
          templatesDir: options.templatesDir,
          to: options.to,
        })
      ),
    ]);
  }

  private copyAssets(options: {
    to: string;
    templatesDir: string;
  }): Promise<void> {
    return WRAPPERS.copyFiles(
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
