import { resolve } from 'path';
import { IVersion } from '../../models/version';
import { ISource } from '../../models/source';
import { IDocumentation } from '../../models/documentation';
import { Logger } from '../../logger/logger';
import { RendererHelper } from '../../helpers/renderer/renderer';
import { SourceRenderer } from '../source/source';

export class VersionRenderer {
  constructor(
    private options: {
      renderer: RendererHelper;
      logger: Logger;
    }
  ) {}

  public async render(
    version: IVersion,
    options: {
      documentation: IDocumentation;
      from: string;
      to: string;
    }
  ): Promise<void> {
    await Promise.all([
      this.options.renderer.renderTemplate(
        'version.html',
        resolve(options.to, version.id, 'index.html'),
        {
          data: {
            documentation: options.documentation,
            version,
          },
        }
      ),
      ...version.sources.map((source) =>
        this.renderSource(version, source, options)
      ),
    ]);
  }

  private renderSource(
    version: IVersion,
    source: ISource,
    options: {
      documentation: IDocumentation;
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    const toDir = resolve(options.to, version.id);
    const fromDir = resolve(options.from, version.id);
    return new SourceRenderer(this.options).render(source, {
      from: fromDir,
      to: toDir,
      documentation: options.documentation,
      version,
    });
  }
}
