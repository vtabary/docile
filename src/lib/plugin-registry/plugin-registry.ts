import { ISourceDownloader } from '../downloaders/source/source';
import { Logger } from '../logger/logger';
import { ITemplateRenderer } from '../renderers/source/source';

export type IPluginEntry =
  | {
      class: new (options: {
        logger: Logger;
        cwd: string;
        downloadDir: string;
      }) => ITemplateRenderer;
      type: 'renderer';
      extension: string;
    }
  | {
      class: new (options: {
        logger: Logger;
        cwd: string;
        downloadDir: string;
      }) => ISourceDownloader;
      type: 'downloader';
      sourceType: string;
    };

export class PluginRegistry<T> {
  private registry = new Map<string, T>();

  public async register(key: string, plugin: T): Promise<void> {
    this.registry.set(key, plugin);
  }

  public unregister(key: string): void {
    this.registry.delete(key);
  }

  public get(key: string): T | undefined {
    return this.registry.get(key);
  }

  public keys(): string[] {
    return Array.from(this.registry.keys());
  }
}
