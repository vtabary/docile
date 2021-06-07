import { Logger } from '../../logger/logger';
import { IDocumentation } from '../../models/documentation';
import { ISource } from '../../models/source';
import { IVersion } from '../../models/version';
import { PluginRegistry } from '../../plugin-registry/plugin-registry';
import { IDownloader } from '../downloader';
import { ErrorSourceDownloader } from './error/error';

export interface ISourceDownloader
  extends IDownloader<{
    documentation: IDocumentation;
    version: IVersion;
    source: ISource;
  }> {
  download(data: {
    documentation: IDocumentation;
    version: IVersion;
    source: ISource;
  }): Promise<void>;
}

export class SourceDownloader implements ISourceDownloader {
  private defaultDownloader = new ErrorSourceDownloader(this.options);

  constructor(
    private options: {
      logger: Logger;
      downloadDir: string;
      cwd: string;
      downloaders: PluginRegistry<ISourceDownloader>;
    }
  ) {}

  public download(data: {
    documentation: IDocumentation;
    version: IVersion;
    source: ISource;
  }): Promise<void> {
    const downloader =
      this.options.downloaders.get(data.source.type) || this.defaultDownloader;
    return downloader.download(data);
  }
}
