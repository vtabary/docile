import { Logger } from '../../../logger/logger';
import { ISource } from '../source';

export class ErrorSource implements ISource {
  public readonly id: string;
  public readonly path = '';
  private logger: Logger;

  public constructor(data: { id: string }, options: { logger: Logger }) {
    this.id = data.id;
    this.logger = options.logger;
    return this;
  }

  public async download(): Promise<void> {
    this.logger.error(`Can't copy the source "${this.id}"`);
    throw new Error(`Can't copy the source "${this.id}"`);
  }
}
