import simpleGit from 'simple-git/promise';
import { resolve } from 'path';
import { ISource } from '../source';
import { Logger } from '../../../logger/logger';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  git: () => simpleGit(),
};

export class GitSource implements ISource {
  public readonly id: string;
  public path: string;
  public branch: string;
  private logger: Logger;

  constructor(
    data: { id: string; path: string; branch?: string },
    options: { logger: Logger }
  ) {
    this.id = data.id;
    this.path = data.path;
    this.branch = data.branch || 'master';
    this.logger = options.logger;
  }

  public async download(outDir: string): Promise<void> {
    const to = resolve(outDir, this.id);
    const git = WRAPPERS.git();
    this.logger.info(`Cloning files...
  from "${this.path}"
  to "${to}"`);

    await git.clone(this.path, to);
    await git.checkout(this.branch);
  }
}
