import marked from 'marked';
import { readFile } from '../../../helpers/file/file';

export class MarkdownRenderer {
  public async render(
    filePath: string,
    options: {
      baseUrl?: '/';
    }
  ): Promise<string> {
    const content = await readFile(filePath);
    return marked(content, {
      gfm: true,
      baseUrl: options.baseUrl || '/',
    });
  }
}
