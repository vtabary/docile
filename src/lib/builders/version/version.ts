import { Logger } from '../../logger/logger';
import { IBuildContext } from '../../models/build-context/build-context';
import { Version } from '../../models/version/version';
import { ISourceConfiguration, SourceBuilder } from '../source/source';

export interface IVersionConfiguration {
  label?: string;
  sources: { [label: string]: ISourceConfiguration };
}

export class VersionBuilder {
  private sourceBuilder: SourceBuilder;

  constructor(
    private buildContext: IBuildContext,
    options: { logger: Logger }
  ) {
    this.sourceBuilder = new SourceBuilder(this.buildContext, options);
  }

  public build(data: { id: string } & IVersionConfiguration): Version {
    const sources = Object.keys(data.sources).map((key) =>
      this.sourceBuilder.build({ id: key, ...data.sources[key] })
    );

    return new Version({
      id: data.id,
      label: data.label,
      sources,
    });
  }
}
