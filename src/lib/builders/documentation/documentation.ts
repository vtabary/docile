import { Logger } from '../../logger/logger';
import { IBuildContext } from '../../models/build-context/build-context';
import { Documentation } from '../../models/documentation/documentation';
import { IVersionConfiguration, VersionBuilder } from '../version/version';

export interface IDocumentationConfiguration {
  label?: string;
  versions?: { [key: string]: IVersionConfiguration };
}

export class DocumentationBuilder {
  private versionBuilder: VersionBuilder;

  constructor(
    private buildContext: IBuildContext,
    options: { logger: Logger }
  ) {
    this.versionBuilder = new VersionBuilder(this.buildContext, options);
  }

  public build(data: IDocumentationConfiguration = {}): Documentation {
    const versions = Object.entries(data.versions || {}).map(([key, value]) =>
      this.versionBuilder.build({ id: key, ...value })
    );

    return new Documentation({
      label: data.label,
      versions,
    });
  }
}
