import download from 'download';
import { resolve } from 'path';
import { Logger } from '../../../logger/logger';
import { IDocumentation } from '../../../models/documentation';
import { ISource } from '../../../models/source';
import { IVersion } from '../../../models/version';
import { ISourceDownloader } from '../source';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  download,
};

export type IHttpSource = ISource<{ path: string }, 'http'>;

export class HttpSourceDownloader implements ISourceDownloader {
  constructor(
    private options: { logger: Logger; cwd: string; downloadDir: string }
  ) {}

  public async download(data: {
    documentation: IDocumentation;
    version: IVersion;
    source: IHttpSource;
  }): Promise<void> {
    const to = resolve(
      this.options.cwd,
      this.options.downloadDir,
      data.version.id,
      data.source.id
    );
    this.options.logger.info(`Copying remote HTTP files...
  from "${data.source.options.path}"
  to "${to}"`);

    await WRAPPERS.download(data.source.options.path, to, { extract: true });
  }
}
