# Docile documentation generator

![Workflow status](https://github.com/vtabary/docile/actions/workflows/node-js.yml/badge.svg)

Docile aims to render one unique documentation portal for multiple projects.

It can get the documentation files from a few source types:

- From local files
- From git repositories
- From an http endpoints

It will downloads all the sources mapped into a `.docile.yml` file and render them as a single website. It supports multiple projects, and, for each project, multiple versions.

## Installation

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
  -p, --project-dir <project_dir>  The documentation project directory (default: current working directory)
  -o, --out-dir <dir>              The directory where to save the rendered views, relative to the project directory
  -t, --theme <module>             The directory or module where to find the templates to use, relative to the project directory (default: "@docile/default-theme")
  --tmp-dir <dir>                  The directory where to save the rendered views, relative to the project directory
  -h, --help                       output usage information
```

## Testing

### Examples

#### Local

```bash
npx ts-node ./src/bin/docile.ts generate -p ./examples/local -o ./public/docs
```

#### Remote Git repositories

```bash
npx ts-node ./src/bin/docile.ts generate -p ./examples/git -o ./public/docs
```

#### Remote HTTP packages

```bash
npx ts-node ./src/bin/docile.ts generate -p ./examples/http -o ./public/docs
```

## Support

## Roadmap

- Generate a list of file for each version
- Support summary files
- Support customization with copyright, logo, favicon, base url, ...
- Export the templates into an other library
- Support custom templates as libraries
- Add markdown function to import a part of a code file

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
