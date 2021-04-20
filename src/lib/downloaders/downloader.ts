export interface IDownloader<T> {
  download(item: T): Promise<void>;
}
