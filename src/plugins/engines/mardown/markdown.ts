import marked from 'marked';
import { IPluginEntry, ITemplateRenderer } from '@lib';

export class MarkdownRenderer implements ITemplateRenderer {
  public async render(
    content: string,
    options: {
      baseUrl: string;
      templateDir: string;
    }
  ): Promise<string> {
    return marked(content, {
      gfm: true,
      baseUrl: options.baseUrl || '/',
    });
  }
}

export default {
  class: MarkdownRenderer,
  type: 'renderer',
  extension: 'md',
} as IPluginEntry;
