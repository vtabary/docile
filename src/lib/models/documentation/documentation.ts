import { Version, IVersionObject } from '../version/version';
import { Utils } from '../../helpers/utils/utils';

export interface IDocumentationObject {
  label?: string;
  versions: { [key: string]: IVersionObject };
};

export class Documentation {
  public label = 'Untitled documentation';
  public versions: Version[] = [];

  public parse(data: IDocumentationObject): Documentation {
    this.label = data.label || this.label;
    this.versions = Object.keys(data.versions)
      .map(key => {
        const version = new Version().parse(data.versions[key]);
        version.id = key;
        return version;
      });
    return this;
  }

  public download(outDir: string): Promise<void> {
    return Utils.promiseAllVoid(
      this.versions.map(version => version.download(outDir))
    );
  }
}
