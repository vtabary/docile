import simpleGit from 'simple-git/promise';
import { resolve } from 'path';
import { Logger } from '../../../logger/logger';
import { ISource } from '../../../models/source';
import { ISourceDownloader } from '../source';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  git: (): simpleGit.SimpleGit => simpleGit(),
};

export type IGitSource = ISource<{ url: string; branch?: string }, 'git'>;

export class GitSourceDownloader implements ISourceDownloader {
  constructor(
    private options: { logger: Logger; cwd: string; downloadDir: string }
  ) {}

  public async download(source: IGitSource): Promise<void> {
    const to = resolve(this.options.cwd, this.options.downloadDir, source.id);
    const git = WRAPPERS.git();
    this.options.logger.info(`Cloning files...
  from "${source.options.url}"
  to "${to}"`);

    await git.clone(source.options.url, to);
    await git.checkout(this.getBranch(source));
  }

  private getBranch(source: IGitSource): string {
    return source.options.branch || 'master';
  }
}
