import simpleGit from 'simple-git/promise';
import { resolve } from 'path';
import { ISource, ISourceObject } from '../source';

export interface IGitSourceObject extends ISourceObject {
  branch?: string;
}

export class GitSource implements ISource {
  public id = 'unknown';
  public path: string;
  public branch: string;

  constructor(
    data: IGitSourceObject
  ) {
    this.path = data.path;
    this.branch = data.branch || 'master';
  }

  public async download(outDir: string): Promise<void> {
    const to = resolve(outDir, this.id);
    const git = simpleGit();
    console.log(`Cloning files...
  from "${this.path}"
  to "${to}"`);

    await git.clone(this.path, to);
    await git.checkout(this.branch);
  }
}
