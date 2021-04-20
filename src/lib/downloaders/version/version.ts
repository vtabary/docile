import { Logger } from '../../logger/logger';
import { IDocumentation } from '../../models/documentation';
import { IVersion } from '../../models/version';
import { IDownloader } from '../downloader';
import { SourceDownloader } from '../source/source';

export class VersionDownloader
  implements IDownloader<{ documentation: IDocumentation; version: IVersion }> {
  constructor(
    private options: { logger: Logger; downloadDir: string; cwd: string }
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
