import { renderFile } from 'ejs';
import { dirname } from 'path';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  renderFile,
};

export class EJSRenderer {
  public async render(
    filePath: string,
    options: {
      baseUrl?: '/';
      data?: { [key: string]: any };
    }
  ): Promise<string> {
    return await WRAPPERS.renderFile(filePath, options.data, {
      root: dirname(filePath),
    });
  }
}
