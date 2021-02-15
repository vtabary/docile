import { Command } from 'commander';
import version from '../data/version';
import { DocileCli } from '../lib/cli/docile';

const program = new Command();
program.version(version.number);

program
  .command('generate')
  .description('Generate the documentation based on the .docile.yml file')
  .option(
    '-p, --project <projet_dir>',
    'The documentation project directory',
    process.cwd()
  )
  .action((args: { project: string }) => {
    return new DocileCli().generate({
      cwd: args.project,
    });
  });

program.parse(process.argv);
