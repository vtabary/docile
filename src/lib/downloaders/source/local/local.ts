import { copy } from 'fs-extra';
import { resolve } from 'path';
import { Logger } from '../../../logger/logger';
import { ISource } from '../../../models/source';
import { ISourceDownloader } from '../source';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  copy,
};

export type ILocalSource = ISource<{ path: string }, 'local'>;

export class LocalSourceDownloader implements ISourceDownloader {
  constructor(
    private options: { logger: Logger; cwd: string; downloadDir: string }
  ) {}

  public download(source: ILocalSource): Promise<void> {
    const path = resolve(this.options.cwd, source.options.path);

    const from = resolve(path);
    const to = resolve(this.options.cwd, this.options.downloadDir, source.id);
    this.options.logger.info(`Copying local files...
  from "${from}"
  to "${to}"`);
    return WRAPPERS.copy(from, to);
  }
}
