import { IDocumentation } from '../../models/documentation';
import { VersionBuilder, IVersionConfiguration } from './version/version';

export interface IDocumentationConfiguration {
  label?: string;
  versions: { [key: string]: IVersionConfiguration };
}

export class DocumentationBuilder {
  private versionBuilder = new VersionBuilder();

  /**
   * Convert a configuration to a valid object
   * @param data
   * @returns the new object
   */
  public build(documentation: IDocumentationConfiguration): IDocumentation {
    const versions = Object.entries(
      documentation.versions || {}
    ).map(([key, value]) => this.versionBuilder.build(key, value));

    return {
      label: documentation.label,
      versions,
    };
  }

  /**
   * Validate a configuration for a documentation
   * @param data the do
   * @returns
   */
  public validate(
    data?: IDocumentationConfiguration
  ): data is IDocumentationConfiguration {
    const versionBuilder = new VersionBuilder();
    return (
      !!data?.versions &&
      Object.keys(data.versions).length > 0 &&
      Object.values(data.versions).every((version) =>
        versionBuilder.validate(version)
      )
    );
  }
}
