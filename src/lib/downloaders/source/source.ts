import { Logger } from '../../logger/logger';
import { ISource } from '../../models/source';
import { IDownloader } from '../downloader';
import { ErrorSourceDownloader } from './error/error';
import { GitSourceDownloader } from './git/git';
import { HttpSourceDownloader } from './http/http';
import { LocalSourceDownloader } from './local/local';

export interface ISourceDownloader extends IDownloader<ISource> {
  download(source: ISource): Promise<void>;
}

export class SourceDownloader implements ISourceDownloader {
  private downloaders: { [type: string]: ISourceDownloader } = {
    git: new GitSourceDownloader(this.options),
    http: new HttpSourceDownloader(this.options),
    local: new LocalSourceDownloader(this.options),
    error: new ErrorSourceDownloader(this.options),
  };

  constructor(
    private options: { logger: Logger; downloadDir: string; cwd: string }
  ) {}

  public download(source: ISource): Promise<void> {
    const downloader =
      this.downloaders[source.type] || this.downloaders['error'];
    return downloader.download(source);
  }
}
