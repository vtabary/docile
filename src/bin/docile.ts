import { Command } from 'commander';
import { resolve } from 'path';
import { DocileCli } from '../lib/cli/docile';

const program = new Command();

const pjson = require(resolve(__dirname, '../../package.json'));
program
  .version(pjson.version);

program
  .command('generate')
  .description('Generate the documentation based on the .docile.yml file')
  .option('-p, --project <projet_dir>', 'The documentation project directory', process.cwd())
  .action((args: { project?: string }) => {
    return new DocileCli().generate({
      cwd: args.project
    });
  });

program
  .parse(process.argv);
