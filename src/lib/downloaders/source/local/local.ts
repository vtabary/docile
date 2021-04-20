import { copy } from 'fs-extra';
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
  copy,
};

export type ILocalSource = ISource<{ path: string }, 'local'>;

export class LocalSourceDownloader implements ISourceDownloader {
  constructor(
    private options: { logger: Logger; cwd: string; downloadDir: string }
  ) {}

  public download(data: {
    documentation: IDocumentation;
    version: IVersion;
    source: ILocalSource;
  }): Promise<void> {
    const path = resolve(this.options.cwd, data.source.options.path);

    const from = resolve(path);
    const to = resolve(
      this.options.cwd,
      this.options.downloadDir,
      data.version.id,
      data.source.id
    );
    this.options.logger.info(`Copying local files...
  from "${from}"
  to "${to}"`);
    return WRAPPERS.copy(from, to);
  }
}
