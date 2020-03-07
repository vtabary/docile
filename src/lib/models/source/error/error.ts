import { ISource, ISourceObject } from '../source';

export class ErrorSource implements ISource {
  public id = 'error';
  public path: string = '';

  public parse(data: ISourceObject): ErrorSource {
    return this;
  }

  public download(outDir: string): Promise<void> {
    console.log(`Can't copy the source ${this.id}`);
    return Promise.resolve();
  }
}
