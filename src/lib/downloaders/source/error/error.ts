import { Logger } from '../../../logger/logger';
import { ISource } from '../../../models/source';
import { ISourceDownloader } from '../source';

export type IErrorSource = ISource<Record<string, never>>;

export class ErrorSourceDownloader implements ISourceDownloader {
  public constructor(private options: { logger: Logger }) {}

  public async download(source: IErrorSource): Promise<void> {
    const errorMessage = `Can't copy the source "${source.id}"`;
    this.options.logger.error(errorMessage);
    throw new Error(`Can't copy the source "${source.id}"`);
  }
}
