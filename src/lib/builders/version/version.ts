import { IVersion } from '../../models/version';
import { ISourceConfiguration, SourceBuilder } from '../source/source';

export interface IVersionConfiguration {
  label?: string;
  sources: { [label: string]: ISourceConfiguration };
}

export class VersionBuilder {
  private sourceBuilder = new SourceBuilder();

  /**
   * Convert a configuration to a valid object
   * @param key
   * @param version
   * @returns
   */
  public build(key: string, version: IVersionConfiguration): IVersion {
    const sources = Object.entries(version.sources).map(([key, source]) =>
      this.sourceBuilder.build(key, source)
    );

    return {
      id: key,
      label: version.label,
      sources,
    };
  }

  /**
   * Validate the configuration of a version
   * @param data the version to validate
   * @returns true when the version has all the data
   */
  public validate(data?: IVersionConfiguration): boolean {
    const builder = new SourceBuilder();
    return (
      !!data?.sources &&
      Object.keys(data.sources).length > 0 &&
      Object.values(data.sources).every((source) => builder.validate(source))
    );
  }
}
