import marked from 'marked';
import { File } from '../../file/file';

export class MarkdownGenerator {
  public async generate(
    filePath: string,
    options: {
      baseUrl?: '/';
    }
  ): Promise<string> {
    const content = await File.readFile(filePath);
    return marked(content, {
      gfm: true,
      baseUrl: options.baseUrl || '/',
    });
  }
}
