export interface ISource {
  id: string;
  path: string;

  download(outDir: string): Promise<void>;
}
