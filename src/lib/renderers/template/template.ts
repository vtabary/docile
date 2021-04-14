import { resolve, basename } from 'path';
import { writeFile } from '../../helpers/file/file';
import { Documentation } from '../../models/documentation/documentation';
import { EJSRenderer } from '../engines/ejs/ejs';

export class TemplateRenderer {
  public async render(
    templatePath: string,
    to: string,
    options: {
      data: { documentation: Documentation; [key: string]: any };
      fileName?: string;
    }
  ): Promise<void> {
    const content = await new EJSRenderer().render(templatePath, {
      data: options.data,
    });
    return writeFile(
      resolve(to, options.fileName || basename(templatePath)),
      content
    );
  }
}
