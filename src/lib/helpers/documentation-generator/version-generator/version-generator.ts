import { resolve } from 'path';
import { Version } from '../../../models/version/version';
import { ISource } from '../../../models/source/source';
import { Documentation } from '../../../models/documentation/documentation';
import { Utils } from '../../utils/utils';
import { TemplateGenerator } from '../template-generator/template-generator';
import { SourceGenerator } from '../source-generator/source-generator';

export class VersionGenerator {
  public generate(version: Version, options: { documentation: Documentation, from: string, to: string, templatesDir: string }): Promise<void> {
    return Utils.promiseAllVoid([
      this.generateIndex(version, options),
      ...version.sources.map(source => this.generateSource(version, source, options)),
    ]);
  }

  private generateIndex(version: Version, options: { documentation: Documentation, to: string, templatesDir: string }): Promise<void> {
    const toDir = resolve(options.to, version.id);
    return new TemplateGenerator().generate(
      resolve(options.templatesDir, 'version.html'),
      toDir,
      {
        data: {
          documentation: options.documentation,
          version,
        },
        fileName: 'index.html',
      }
    )
  }

  private generateSource(version: Version, source: ISource, options: { documentation: Documentation, from: string; to: string, templatesDir: string }): Promise<void> {
    const toDir = resolve(options.to, version.id);
    const fromDir = resolve(options.from, version.id);
    return new SourceGenerator().generate(
      source,
      {
        from: fromDir,
        to: toDir,
        templatesDir: options.templatesDir,
        documentation: options.documentation,
        version,
      }
    )
  }
}
