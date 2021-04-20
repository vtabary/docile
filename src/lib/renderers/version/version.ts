import { resolve } from 'path';
import { IVersion } from '../../models/version';
import { ISource } from '../../models/source';
import { IDocumentation } from '../../models/documentation';
import { TemplateRenderer } from '../template/template';
import { SourceRenderer } from '../source/source';

export class VersionRenderer {
  public async render(
    version: IVersion,
    options: {
      documentation: IDocumentation;
      from: string;
      to: string;
      templatesDir: string;
    }
  ): Promise<void> {
    await Promise.all([
      this.renderIndex(version, options),
      ...version.sources.map((source) =>
        this.renderSource(version, source, options)
      ),
    ]);
  }

  private renderIndex(
    version: IVersion,
    options: { documentation: IDocumentation; to: string; templatesDir: string }
  ): Promise<void> {
    const toDir = resolve(options.to, version.id);
    return new TemplateRenderer().render(
      resolve(options.templatesDir, 'version.html'),
      toDir,
      {
        data: {
          documentation: options.documentation,
          version,
        },
        fileName: 'index.html',
      }
    );
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
    return new SourceRenderer().render(source, {
      from: fromDir,
      to: toDir,
      templatesDir: options.templatesDir,
      documentation: options.documentation,
      version,
    });
  }
}
