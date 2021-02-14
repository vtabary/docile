import { promises } from 'fs';
import { dirname, resolve } from 'path';
import globby from 'globby';

/**
 * For test purpose only
 */
export const WRAPPERS = {
  globby,
};

export async function recursiveMkdir(dirPath: string): Promise<void> {
  await promises.mkdir(resolve(dirPath), { recursive: true });
}

export function readFile(filePath: string): Promise<string> {
  return promises.readFile(resolve(filePath), { encoding: 'utf-8' });
}

/**
 * Create all the directory recursively before creating the file itself in order to prevent a path error
 * @param filePath the file path, using the process.cwd() as working directory
 * @param data
 */
export async function writeFile(filePath: string, data: string): Promise<void> {
  await recursiveMkdir(dirname(filePath));
  return promises.writeFile(resolve(filePath), data, { encoding: 'utf-8' });
}

export async function listFiles(
  srcDir: string,
  globs: string[],
  options: { absolute?: boolean } = {}
): Promise<string[]> {
  return WRAPPERS.globby(globs, {
    cwd: resolve(srcDir),
    absolute: options.absolute !== false,
  });
}

export async function copyFiles(
  srcDir: string,
  globs: string[],
  toDir: string
): Promise<void> {
  const files = await listFiles(srcDir, globs, { absolute: false });
  await Promise.all(
    files.map((file) => copyFile(resolve(srcDir, file), resolve(toDir, file)))
  );
}

export async function copyFile(
  absoluteSrcFile: string,
  absoluteToFile: string
): Promise<void> {
  await recursiveMkdir(dirname(absoluteToFile));
  return promises.copyFile(absoluteSrcFile, absoluteToFile);
}
