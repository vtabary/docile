import { resolve, basename, dirname } from 'path';
import { renderFile } from 'ejs';
import { writeFile } from '../../helpers/file/file';
import { Documentation } from '../../models/documentation/documentation';

export class TemplateGenerator {
  public async generate(
    templatePath: string,
    to: string,
    options: {
      data: { documentation: Documentation; [key: string]: any };
      fileName?: string;
    }
  ): Promise<void> {
    const content = await renderFile(templatePath, options.data, {
      root: dirname(templatePath),
    });
    return writeFile(
      resolve(to, options.fileName || basename(templatePath)),
      content
    );
  }
}
