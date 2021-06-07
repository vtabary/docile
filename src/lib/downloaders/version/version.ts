import { Logger } from '../../logger/logger';
import { IDocumentation } from '../../models/documentation';
import { IVersion } from '../../models/version';
import { PluginRegistry } from '../../plugin-registry/plugin-registry';
import { IDownloader } from '../downloader';
import { ISourceDownloader, SourceDownloader } from '../source/source';

export class VersionDownloader
  implements IDownloader<{ documentation: IDocumentation; version: IVersion }> {
  constructor(
    private options: {
      logger: Logger;
      downloadDir: string;
      cwd: string;
      downloaders: PluginRegistry<ISourceDownloader>;
    }
  ) {}

  public async download(data: {
    documentation: IDocumentation;
    version: IVersion;
  }): Promise<void> {
    const sourceDownloader = new SourceDownloader(this.options);
    await Promise.all(
      data.version.sources.map((source) =>
        sourceDownloader.download({ ...data, source })
      )
    );
  }
}
