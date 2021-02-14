import { Documentation } from '../models/documentation/documentation';
import { Configurationloader } from '../configuration-loader/configuration-loader';
import { IBuildContext } from '../models/build-context/build-context';
import { DocumentationGenerator } from '../documentation-generator/documentation-generator';

export class DocileCli {
  private configuration?: {
    documentation: Documentation;
    build: IBuildContext;
  };

  public async generate(options: { cwd?: string } = {}): Promise<void> {
    const configuration = await this.loadConfiguration(options);
    await this.download(options);
    await new DocumentationGenerator()
      .generate(configuration.documentation, {
        from: configuration.build.tmpDir,
        to: configuration.build.outDir,
        templatesDir: configuration.build.templatesDir,
      })
      .catch((e: Error) => {
        console.error(e.message);
        process.exit(1);
      });
  }

  public async download(options: { cwd?: string } = {}): Promise<void> {
    const configuration = await this.loadConfiguration(options);
    await configuration.documentation
      .download(configuration.build.tmpDir)
      .catch((e: Error) => {
        console.error(e.message);
        process.exit(1);
      });
  }

  private async loadConfiguration(
    options: { cwd?: string } = {}
  ): Promise<{ documentation: Documentation; build: IBuildContext }> {
    if (!this.configuration) {
      this.configuration = await new Configurationloader().load(options);
    }

    return this.configuration;
  }
}
