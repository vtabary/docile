import { Command } from 'commander';
import version from '../data/version';
import { DocileCli } from '../lib/cli/docile';
import { Logger } from '../lib/logger/logger';

const program = new Command();
program.version(version.number);

const logger = new Logger();

program
  .command('generate')
  .description('Generate the documentation based on the .docile.yml file')
  .option(
    '-p, --project-dir <project_dir>',
    'The documentation project directory',
    process.cwd()
  )
  .option(
    '-o, --out-dir <dir>',
    'The directory where to save the rendered views, relative to the project directory'
  )
  .option(
    '-t, --theme <module>',
    'The directory or module where to find the templates to use, relative to the project directory',
    '@docile/default-theme'
  )
  .option(
    '--tmp-dir <dir>',
    'The directory where to save the rendered views, relative to the project directory'
  )
  .action(
    (args: {
      projectDir: string;
      tmpDir?: string;
      outDir?: string;
      theme: string;
    }) => {
      return new DocileCli({ logger })
        .generate({
          projectDir: args.projectDir,
          templates: args.theme,
          outDir: args.outDir,
          tmpDir: args.tmpDir,
        })
        .catch((e: Error) => {
          logger.error(e.message);
          process.exit(1);
        });
    }
  );

program.parse(process.argv);
