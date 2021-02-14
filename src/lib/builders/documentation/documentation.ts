import { Documentation } from '../../models/documentation/documentation';
import { IVersionConfiguration, VersionBuilder } from '../version/version';

export interface IDocumentationConfiguration {
  label?: string;
  versions: { [key: string]: IVersionConfiguration };
}

export class DocumentationBuilder {
  private versionBuilder = new VersionBuilder();

  public build(data: IDocumentationConfiguration): Documentation {
    const versions = Object.keys(data.versions).map((key) =>
      this.versionBuilder.build({ id: key, ...data.versions[key] })
    );
    return new Documentation({
      label: data.label,
      versions,
    });
  }
}
