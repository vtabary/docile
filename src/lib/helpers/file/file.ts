import { promises } from 'fs';
import { dirname, resolve } from 'path';
import globby from 'globby';
import { Utils } from '../utils/utils';

export class File {
  public static recursiveMkdir(dirPath: string): Promise<void> {
    return promises.mkdir(resolve(dirPath), { recursive: true });
  }

  public static readFile(filePath: string): Promise<string> {
    return promises.readFile(resolve(filePath), { encoding: 'utf-8' });
  }

  public static async writeFile(filePath: string, data: string): Promise<void> {
    await File.recursiveMkdir(dirname(filePath));
    return promises.writeFile(resolve(filePath), data, { encoding: 'utf-8' });
  }

  public static async listFiles(srcDir: string, globs: string[], options: { absolute?: boolean } = {}): Promise<string[]> {
    return globby(globs || [], { cwd: resolve(srcDir), absolute: options.absolute !== false });
  }

  public static async copyFiles(srcDir: string, globs: string[], toDir: string): Promise<void> {
    const files = await File.listFiles(srcDir, globs, { absolute: false });
    return Utils.promiseAllVoid(
      files.map(file => this.copyFile(resolve(srcDir, file), resolve(toDir, file)))
    );
  }

  public static async copyFile(absoluteSrcFile: string, absoluteToFile: string): Promise<void> {
    await File.recursiveMkdir(dirname(absoluteToFile));
    return promises.copyFile(absoluteSrcFile, absoluteToFile);
  }
}
