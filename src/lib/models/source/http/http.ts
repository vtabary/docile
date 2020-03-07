import download from 'download';
import { resolve } from 'path';
import { ISource, ISourceObject } from '../source';

export interface IHttpSourceObject extends ISourceObject {

}

export class HttpSource implements ISource {
  public id = 'unknown';
  public path: string;

  constructor(
    data: IHttpSourceObject
  ) {
    this.path = data.path;
  }

  public download(outDir: string): Promise<void> {
    const to = resolve(outDir, this.id);
    console.log(`Copying remote HTTP files...
  from "${this.path}"
  to "${to}"`);

  return download(this.path, to, { extract: true })
    .then(() => undefined);
  }
}
