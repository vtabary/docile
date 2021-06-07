import { Logger } from '../../../logger/logger';
import { ITemplateRenderer } from '../source';

export class MissingRenderer implements ITemplateRenderer {
  public constructor(private options: { logger: Logger }) {}

  public async render(filepath: string): Promise<string> {
    const errorMessage = `Can't render the file "${filepath}"`;
    this.options.logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
