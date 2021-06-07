import { copy } from 'fs-extra';
import { resolve } from 'path';
import {
  Logger,
  IDocumentation,
  ISource,
  IVersion,
  ISourceDownloader,
  IPluginEntry,
} from '@lib';

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

export default {
  class: LocalSourceDownloader,
  type: 'downloader',
  sourceType: 'local',
} as IPluginEntry;
