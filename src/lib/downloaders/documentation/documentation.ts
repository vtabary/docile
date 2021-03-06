import { Logger } from '../../logger/logger';
import { IDocumentation } from '../../models/documentation';
import { IDownloader } from '../downloader';
import { VersionDownloader } from '../version/version';

export class DocumentationDownloader
  implements IDownloader<{ documentation: IDocumentation }> {
  constructor(
    private options: { logger: Logger; cwd: string; downloadDir: string }
  ) {}

  public async download(data: {
    documentation: IDocumentation;
  }): Promise<void> {
    const versionDownloader = new VersionDownloader(this.options);
    await Promise.all(
      data.documentation.versions.map((version) =>
        versionDownloader.download({ ...data, version })
      )
    );
  }
}
