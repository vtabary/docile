import download from 'download';
import { resolve } from 'path';
import { Logger } from '../../../logger/logger';
import { ISource } from '../source';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  download,
};

export class HttpSource implements ISource {
  public readonly id: string;
  public path: string;
  private logger: Logger;

  constructor(data: { id: string; path: string }, options: { logger: Logger }) {
    this.id = data.id;
    this.path = data.path;
    this.logger = options.logger;
  }

  public async download(outDir: string): Promise<void> {
    const to = resolve(outDir, this.id);
    this.logger.info(`Copying remote HTTP files...
  from "${this.path}"
  to "${to}"`);

    await WRAPPERS.download(this.path, to, { extract: true });
  }
}
