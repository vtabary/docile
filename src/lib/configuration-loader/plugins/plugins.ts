import { ISourceDownloader } from '../../downloaders/source/source';
import { Logger } from '../../logger/logger';
import {
  PluginRegistry,
  IPluginEntry,
} from '../../plugin-registry/plugin-registry';
import { ITemplateRenderer } from '../../renderers/source/source';

export class PluginsBuilder {
  public async build(
    pluginPaths: string[],
    options: {
      logger: Logger;
      cwd: string;
      downloadDir: string;
    }
  ): Promise<{
    renderers: PluginRegistry<ITemplateRenderer>;
    downloaders: PluginRegistry<ISourceDownloader>;
  }> {
    const plugins = await this.loadPlugins(pluginPaths);
    return this.buildRegistries(plugins, options);
  }

  private loadPlugins(pluginPaths: string[] = []): Promise<IPluginEntry[]> {
    return Promise.all(pluginPaths.map((p) => this.loadPlugin(p)));
  }

  private async loadPlugin(pluginPath: string): Promise<IPluginEntry> {
    return await import(pluginPath);
  }

  /**
   * Create the plugins registries from the entry classes and split the plugin entries by type
   * @param plugins the plugin entries from the JS files
   * @param options the options given to the plugin class constructor
   * @returns the plugin registries
   */
  private buildRegistries(
    plugins: IPluginEntry[],
    options: {
      logger: Logger;
      cwd: string;
      downloadDir: string;
    }
  ): {
    renderers: PluginRegistry<ITemplateRenderer>;
    downloaders: PluginRegistry<ISourceDownloader>;
  } {
    const renderers = new PluginRegistry<ITemplateRenderer>();
    const downloaders = new PluginRegistry<ISourceDownloader>();

    plugins.forEach((plugin) => {
      switch (plugin.type) {
        case 'renderer':
          renderers.register(plugin.extension, new plugin.class(options));
          break;
        case 'downloader':
          downloaders.register(plugin.sourceType, new plugin.class(options));
          break;
      }
    });

    return {
      renderers,
      downloaders,
    };
  }
}
