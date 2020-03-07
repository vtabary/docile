import { Documentation } from '../models/documentation/documentation';
import { Configurationloader } from '../helpers/configuration-loader/configuration-loader';
import { IBuildContext } from '../models/build-context/build-context';
import { DocumentationGenerator } from '../helpers/documentation-generator/documentation-generator';

export class DocileCli {
  private configuration?: { documentation: Documentation, build: IBuildContext };

  public async generate(options: { cwd?: string } = {}): Promise<void> {
    const configuration = await this.loadConfiguration(options);
    return this.download(options)
      .then(() => new DocumentationGenerator().generate(
        configuration.documentation,
        {
          from: configuration.build.tmpDir,
          to: configuration.build.outDir,
          templatesDir: configuration.build.templatesDir,
        }
      ));
  }

  public async download(options: { cwd?: string } = {}): Promise<void> {
    const configuration = await this.loadConfiguration(options);
    return configuration.documentation.download(configuration.build.tmpDir);
  }

  private async loadConfiguration(options: { cwd?: string } = {}): Promise<{ documentation: Documentation, build: IBuildContext }> {
    if (!this.configuration) {
      this.configuration = await new Configurationloader().load(options);
    }

    return this.configuration;
  }
}
