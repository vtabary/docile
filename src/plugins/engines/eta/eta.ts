import { renderAsync } from 'eta';
import { resolve } from 'path';
import { IPluginEntry, ITemplateRenderer } from '@lib';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  renderAsync,
};

export class ETARenderer implements ITemplateRenderer {
  public async render(
    content: string,
    options: {
      baseUrl: '/';
      templateDir: string;
      data?: { [key: string]: unknown };
    }
  ): Promise<string> {
    return (
      (await WRAPPERS.renderAsync(content, options.data || {}, {
        views: resolve(options.templateDir),
      })) || ''
    );
  }
}

export default {
  class: ETARenderer,
  type: 'renderer',
  extension: 'eta',
} as IPluginEntry;
