import { IDocumentation } from '../../models/documentation';
import { copyFiles } from '../../helpers/file/file';
import { VersionRenderer } from '../version/version';
import { Logger } from '../../logger/logger';
import { RendererHelper } from '../../helpers/renderer/renderer';

/**
 * For test purposes only
 */
export const WRAPPERS = {
  copyFiles,
};

export class DocumentationRenderer {
  private logger: Logger;
  private renderer: RendererHelper;

  constructor(options: { logger: Logger; renderer: RendererHelper }) {
    this.logger = options.logger;
    this.renderer = options.renderer;
  }

  public async render(
    documentation: IDocumentation,
    options: {
      from: string;
      to: string;
    }
  ): Promise<void> {
    this.logger.info(`Compiling from "${options.from}" to "${options.to}"...`);

    await this.renderFiles(documentation, options);
    await this.renderer.copyAssets(options);
  }

  private async renderFiles(
    documentation: IDocumentation,
    options: {
      from: string;
      to: string;
    }
  ): Promise<void> {
    const versionRenderer = new VersionRenderer({
      logger: this.logger,
      renderer: this.renderer,
    });

    await Promise.all([
      this.renderer.renderTemplate('index.eta', options.to, {
        data: { documentation },
      }),
      ...documentation.versions.map((version) =>
        versionRenderer.render(version, {
          from: options.from,
          documentation: documentation,
          to: options.to,
        })
      ),
    ]);
  }
}
