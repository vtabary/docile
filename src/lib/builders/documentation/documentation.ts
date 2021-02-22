import { IBuildContext } from '../../models/build-context/build-context';
import { Documentation } from '../../models/documentation/documentation';
import { IVersionConfiguration, VersionBuilder } from '../version/version';

export interface IDocumentationConfiguration {
  label?: string;
  versions?: { [key: string]: IVersionConfiguration };
}

export class DocumentationBuilder {
  constructor(private buildContext: IBuildContext) {}

  public build(data: IDocumentationConfiguration = {}): Documentation {
    const versionBuilder = new VersionBuilder(this.buildContext);
    const versions = Object.entries(data.versions || {}).map(([key, value]) =>
      versionBuilder.build({ id: key, ...value })
    );

    return new Documentation({
      label: data.label,
      versions,
    });
  }
}
