import { resolve } from 'path';
import { SourceBuilder } from '../../helpers/source-builder/source-builder';
import { ISource, ISourceObject } from '../source/source';
import { Utils } from '../../helpers/utils/utils';

export interface IVersionObject {
  label?: string;
  sources: { [label: string]: ISourceObject };
}

export class Version {
  public sources: ISource[] = [];
  public id: string = 'unknown';
  public label: string = 'Untitled version';

  public parse(data: IVersionObject): Version {
    this.label = data.label || this.label;

    this.sources = Object.keys(data.sources)
      .map(key => {
        const source = new SourceBuilder().parse(data.sources[key]);
        source.id = key;
        return source;
      });
    return this;
  }

  public download(outDir: string): Promise<void> {
    return Utils.promiseAllVoid(
      this.sources.map(source => source.download(resolve(outDir, this.id)))
    );
  }
}
