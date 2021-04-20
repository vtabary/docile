import { resolve } from 'path';
import { IBuildContext } from '../../models/build-context';

export class ContextBuilder {
  public build(
    data: Partial<IBuildContext> = {},
    options: { cwd?: string } = {}
  ): IBuildContext {
    const projectPath = options.cwd || process.cwd();
    return {
      outDir: this.resolveOutDir(data.outDir, { projectPath }),
      tmpDir: this.resolveTmpDir(data.tmpDir, { projectPath }),
      templatesDir: this.resolveTemplatesDir(data.templatesDir, {
        projectPath,
      }),
      cwd: options.cwd || process.cwd(),
    };
  }

  private resolveTemplatesDir(
    givenDir: string | undefined,
    options: { projectPath: string }
  ): string {
    if (!givenDir) {
      // TODO: default should be a default library template
      return resolve(__dirname, '../../../../templates');
    }

    // TODO: support templates from other libraries using require.resolve
    return resolve(options.projectPath, givenDir);
  }

  private resolveOutDir(
    givenDir: string | undefined,
    options: { projectPath: string }
  ): string {
    if (!givenDir) {
      return resolve(options.projectPath, 'public/docs');
    }

    return resolve(options.projectPath, givenDir);
  }

  private resolveTmpDir(
    givenDir: string | undefined,
    options: { projectPath: string }
  ): string {
    if (!givenDir) {
      return resolve(options.projectPath, '.tmp');
    }

    return resolve(options.projectPath, givenDir);
  }
}
