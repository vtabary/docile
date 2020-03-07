# Docile documentation generator

## Install

```bash
# Local
npm install --save-dev @docile/documentation
# Or
yarn add --dev @docile/documentation

# Globally
npm install -g @docile/documentation
# Or
yarn global add @docile/documentation
```

## Usage

```
Usage: docile [options] [command]

Options:
  -V, --version       output the version number
  -h, --help          output usage information

Commands:
  generate [options]  Generate the documentation based on the .docile.yml file
```

### Generate

```
Usage: docile generate [options]

Generate the documentation based on the .docile.yml file

Options:
  -p, --project <projet_dir>  The documentation project directory (default: "C:\\Users\\vince\\Developpement\\vtabary\\docile")
  -h, --help                  output usage information
```

## Test

### Examples

#### Local

```bash
npx ts-node ./src/bin/docile.ts generate -p ./examples/local
```

#### Remote Git repositories

```bash
npx ts-node ./src/bin/docile.ts generate -p ./examples/git
```

#### Remote HTTP packages

```bash
npx ts-node ./src/bin/docile.ts generate -p ./examples/http
```

## TODO

* Add specs
* Support summary files
* Export the templates into an other library
* Support custom templates as a libraries
* Add markdown function to import a part of a code file
