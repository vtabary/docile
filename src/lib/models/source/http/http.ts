import download from 'download';
import { resolve } from 'path';
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

  constructor(data: { id: string; path: string }) {
    this.id = data.id;
    this.path = data.path;
  }

  public async download(outDir: string): Promise<void> {
    const to = resolve(outDir, this.id);
    console.log(`Copying remote HTTP files...
  from "${this.path}"
  to "${to}"`);

    await WRAPPERS.download(this.path, to, { extract: true });
  }
}
