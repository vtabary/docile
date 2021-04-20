import { Logger } from '../../../logger/logger';
import { IDocumentation } from '../../../models/documentation';
import { ISource } from '../../../models/source';
import { IVersion } from '../../../models/version';
import { ISourceDownloader } from '../source';

export type IErrorSource = ISource<Record<string, never>>;

export class ErrorSourceDownloader implements ISourceDownloader {
  public constructor(private options: { logger: Logger }) {}

  public async download(data: {
    documentation: IDocumentation;
    version: IVersion;
    source: IErrorSource;
  }): Promise<void> {
    const errorMessage = `Can't copy the source "${data.source.id}"`;
    this.options.logger.error(errorMessage);
    throw new Error(`Can't copy the source "${data.source.id}"`);
  }
}
