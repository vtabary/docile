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
    '-p, --project <projet_dir>',
    'The documentation project directory',
    process.cwd()
  )
  .action((args: { project: string }) => {
    return new DocileCli({ logger })
      .generate({
        cwd: args.project,
      })
      .catch((e: Error) => {
        logger.error(e.message);
        process.exit(1);
      });
  });

program.parse(process.argv);
