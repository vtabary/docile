import { resolve } from 'path';
import { Version } from '../../models/version/version';
import { ISource } from '../../models/source/source';
import { Documentation } from '../../models/documentation/documentation';
import { TemplateRenderer } from '../template/template';
import { SourceRenderer } from '../source/source';

export class VersionRenderer {
  public async render(
    version: Version,
    options: {
      documentation: Documentation;
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
    version: Version,
    options: { documentation: Documentation; to: string; templatesDir: string }
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
    version: Version,
    source: ISource,
    options: {
      documentation: Documentation;
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
