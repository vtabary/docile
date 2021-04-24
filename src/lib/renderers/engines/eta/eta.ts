import { renderFile } from 'eta';
import { dirname } from 'path';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  renderFile,
};

export class ETARenderer {
  public async render(
    filePath: string,
    options: {
      baseUrl?: '/';
      data?: { [key: string]: unknown };
    }
  ): Promise<string | void> {
    return await WRAPPERS.renderFile(filePath, options.data || {}, {
      views: dirname(filePath),
    });
  }
}
