import simpleGit, { SimpleGit } from 'simple-git';
import { resolve } from 'path';
import { Logger } from '../../../logger/logger';
import { ISource } from '../../../models/source';
import { ISourceDownloader } from '../source';
import { IVersion } from '../../../models/version';
import { IDocumentation } from '../../../models/documentation';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  git: (): SimpleGit => simpleGit(),
};

export type IGitSource = ISource<{ url: string; branch?: string }, 'git'>;

export class GitSourceDownloader implements ISourceDownloader {
  constructor(
    private options: { logger: Logger; cwd: string; downloadDir: string }
  ) {}

  public async download(data: {
    documentation: IDocumentation;
    version: IVersion;
    source: IGitSource;
  }): Promise<void> {
    const to = resolve(
      this.options.cwd,
      this.options.downloadDir,
      data.version.id,
      data.source.id
    );
    const git = WRAPPERS.git();
    this.options.logger.info(`Cloning files...
  from "${data.source.options.url}"
  to "${to}"`);

    await git.clone(data.source.options.url, to);
    await git.checkout(this.getBranch(data.source));
  }

  private getBranch(source: IGitSource): string {
    return source.options.branch || 'master';
  }
}
