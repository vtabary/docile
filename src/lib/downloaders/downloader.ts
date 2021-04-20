export interface IDownloader<T> {
  download(items: T): Promise<void>;
}
