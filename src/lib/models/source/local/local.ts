import { copy } from 'fs-extra';
import { resolve } from 'path';
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

  constructor(data: { id: string; path: string }, buildContext: IBuildContext) {
    this.id = data.id;
    this.path = resolve(buildContext.cwd, data.path);
  }

  public download(outDir: string): Promise<void> {
    const from = resolve(this.path);
    const to = resolve(outDir, this.id);
    console.log(`Copying local files...
  from "${from}"
  to "${to}"`);
    return WRAPPERS.copy(from, to);
  }
}
