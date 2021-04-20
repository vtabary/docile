import { Logger } from '../../logger/logger';
import { IVersion } from '../../models/version';
import { IDownloader } from '../downloader';
import { SourceDownloader } from '../source/source';

export class VersionDownloader implements IDownloader<IVersion> {
  constructor(
    private options: { logger: Logger; downloadDir: string; cwd: string }
  ) {}

  public async download(version: IVersion): Promise<void> {
    const sourceDownloader = new SourceDownloader(this.options);
    await Promise.all(
      version.sources.map((source) => sourceDownloader.download(source))
    );
  }
}
