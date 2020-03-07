import { ISourceObject, ISource } from '../../models/source/source';
import { LocalSource } from '../../models/source/local/local';
import { ErrorSource } from '../../models/source/error/error';
import { GitSource } from '../../models/source/git/git';
import { HttpSource } from '../../models/source/http/http';

export class SourceBuilder {
  public parse(data: ISourceObject): ISource {
    switch (data.type) {
      case 'local':
        return new LocalSource(data);
      case 'git':
        return new GitSource(data);
      case 'http':
        return new HttpSource(data);
    }

    return new ErrorSource();
  }
}
