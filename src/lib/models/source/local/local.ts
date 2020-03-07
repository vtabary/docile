import { copy } from 'fs-extra';
import { resolve } from 'path';
import { ISource, ISourceObject } from '../source';

export interface ILocalSourceObject extends ISourceObject {

}

export class LocalSource implements ISource {
  public id = 'unknown';
  public path: string;

  constructor(
    data: ILocalSourceObject
  ) {
    this.path = data.path;
  }

  public download(outDir: string): Promise<void> {
    const from = resolve(this.path);
    const to = resolve(outDir, this.id);
    console.log(`Copying local files...
  from "${from}"
  to "${to}"`);
    return copy(from, to);
  }
}
