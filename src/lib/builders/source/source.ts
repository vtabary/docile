import { ISource } from '../../models/source/source';
import { LocalSource } from '../../models/source/local/local';
import { ErrorSource } from '../../models/source/error/error';
import { GitSource } from '../../models/source/git/git';
import { HttpSource } from '../../models/source/http/http';

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
  public build(data: { id: string } & ISourceConfiguration): ISource {
    switch (data.type) {
      case 'local':
        return new LocalSource(data);
      case 'git':
        return new GitSource(data);
      case 'http':
        return new HttpSource(data);
      default:
        return new ErrorSource(data);
    }
  }
}
