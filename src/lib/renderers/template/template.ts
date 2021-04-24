import { resolve, basename } from 'path';
import { writeFile } from '../../helpers/file/file';
import { IDocumentation } from '../../models/documentation';
import { ETARenderer } from '../engines/eta/eta';

export class TemplateRenderer {
  public async render(
    templatePath: string,
    to: string,
    options: {
      data: { documentation: IDocumentation; [key: string]: unknown };
      fileName?: string;
    }
  ): Promise<void> {
    const content = await new ETARenderer().render(templatePath, {
      data: options.data,
    });
    return writeFile(
      resolve(to, options.fileName || basename(templatePath)),
      content || ''
    );
  }
}
