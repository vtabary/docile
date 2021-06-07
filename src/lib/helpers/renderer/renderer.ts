import { basename, resolve } from 'path';
import { PluginRegistry } from '../../plugin-registry/plugin-registry';
import { ITemplateRenderer } from '../../renderers/source/source';
import { readFile, writeFile, copyFiles } from '../file/file';

export const WRAPPERS = {
  copyFiles,
};

export class RendererHelper {
  constructor(
    private options: {
      templatesDir: string;
      renderers: PluginRegistry<ITemplateRenderer>;
      baseUrl: string;
    }
  ) {}

  public async renderTemplate(
    relativeTemplatePath: string,
    destPath: string,
    options: {
      data?:
        | {
            [key: string]: unknown;
          }
        | undefined;
    }
  ): Promise<void> {
    const extension = basename(relativeTemplatePath);
    const templateRenderer = this.options.renderers.get(extension);

    if (!templateRenderer) {
      return;
    }

    const templateContent = await readFile(
      resolve(this.options.templatesDir, relativeTemplatePath)
    );

    const renderedContent = await templateRenderer.render(templateContent, {
      ...options,
      templateDir: this.options.templatesDir,
      baseUrl: this.options.baseUrl,
    });

    return writeFile(destPath, renderedContent);
  }

  public copyAssets(options: { to: string }): Promise<void> {
    return WRAPPERS.copyFiles(
      this.options.templatesDir,
      [
        '**/*.css',
        '**/*.png',
        '**/*.jpg',
        '**/*.gif',
        '**/*.svg',
        '**/*.ttf',
        '**/*.eof',
        '**/*.woff',
      ],
      options.to
    );
  }

  public getExtensions(): string[] {
    return this.options.renderers.keys();
  }
}
