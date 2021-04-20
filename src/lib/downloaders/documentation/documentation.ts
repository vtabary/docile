import { Logger } from '../../logger/logger';
import { IDocumentation } from '../../models/documentation';
import { IDownloader } from '../downloader';
import { VersionDownloader } from '../version/version';

export class DocumentationDownloader implements IDownloader<IDocumentation> {
  constructor(
    private options: { logger: Logger; cwd: string; downloadDir: string }
  ) {}

  public async download(documentation: IDocumentation): Promise<void> {
    const versionDownloader = new VersionDownloader(this.options);
    await Promise.all(
      documentation.versions.map((version) =>
        versionDownloader.download(version)
      )
    );
  }
}
