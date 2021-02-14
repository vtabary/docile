import simpleGit from 'simple-git/promise';
import { resolve } from 'path';
import { ISource } from '../source';

export class GitSource implements ISource {
  public readonly id: string;
  public path: string;
  public branch: string;

  constructor(data: { id: string; path: string; branch?: string }) {
    this.id = data.id;
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
