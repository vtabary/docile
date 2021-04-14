import { copy } from 'fs-extra';
import { resolve } from 'path';
import { Logger } from '../../../logger/logger';
import { IBuildContext } from '../../build-context/build-context';
import { ISource } from '../source';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  copy,
};

export class LocalSource implements ISource {
  public readonly id: string;
  public path: string;
  private logger: Logger;

  constructor(
    data: { id: string; path: string },
    options: { logger: Logger; buildContext: IBuildContext }
  ) {
    this.id = data.id;
    this.path = resolve(options.buildContext.cwd, data.path);
    this.logger = options.logger;
  }

  public download(outDir: string): Promise<void> {
    const from = resolve(this.path);
    const to = resolve(outDir, this.id);
    this.logger.info(`Copying local files...
  from "${from}"
  to "${to}"`);
    return WRAPPERS.copy(from, to);
  }
}
