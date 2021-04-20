import download from 'download';
import { resolve } from 'path';
import { Logger } from '../../../logger/logger';
import { ISource } from '../../../models/source';
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

  public async download(source: IHttpSource): Promise<void> {
    const to = resolve(this.options.cwd, this.options.downloadDir, source.id);
    this.options.logger.info(`Copying remote HTTP files...
  from "${source.options.path}"
  to "${to}"`);

    await WRAPPERS.download(source.options.path, to, { extract: true });
  }
}
