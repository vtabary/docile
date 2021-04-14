import { ISource } from '../../models/source/source';
import { LocalSource } from '../../models/source/local/local';
import { ErrorSource } from '../../models/source/error/error';
import { GitSource } from '../../models/source/git/git';
import { HttpSource } from '../../models/source/http/http';
import { IBuildContext } from '../../models/build-context/build-context';
import { Logger } from '../../logger/logger';

export interface IBaseSourceConfiguration {
  type: string;
  path: string;
}

export interface IGitSourceConfiguration extends IBaseSourceConfiguration {
  type: 'git';
  branch?: string;
}

export interface ILocalSourceConfiguration extends IBaseSourceConfiguration {
  type: 'local';
}

export interface IHttpSourceConfiguration extends IBaseSourceConfiguration {
  type: 'http';
}

export type ISourceConfiguration =
  | IGitSourceConfiguration
  | IHttpSourceConfiguration
  | ILocalSourceConfiguration;

export class SourceBuilder {
  private logger: Logger;

  constructor(
    private buildContext: IBuildContext,
    options: { logger: Logger }
  ) {
    this.logger = options.logger;
  }

  public build(data: { id: string } & ISourceConfiguration): ISource {
    switch (data.type) {
      case 'local':
        return new LocalSource(data, {
          logger: this.logger,
          buildContext: this.buildContext,
        });
      case 'git':
        return new GitSource(data, { logger: this.logger });
      case 'http':
        return new HttpSource(data, { logger: this.logger });
      default:
        return new ErrorSource(data, { logger: this.logger });
    }
  }
}
