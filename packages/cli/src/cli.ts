import fs from 'node:fs';

import { Compiler, Parser } from '@type-zen/core';
import cac from 'cac';
import fg from 'fast-glob';

import { version } from '../package.json';
import { loadConfig } from './config';

export { startCLI };

interface Options {
  config?: string;
  // watch?: boolean;
}

async function startCLI(cwd: string = process.cwd(), argv: string[] = process.argv) {
  const cli = cac('tzc');

  cli
    .command('[...files]', 'TypeZen file, Supports glob patterns')
    .option('-c, --config [path]', '[string] Config file')
    // .option('-w, --watch', 'Watch for file changes')
    .action(async (files: string[], options: Options) => {
      const config = await loadConfig({
        configPath: options.config,
        cwd
      });

      const tzenFiles = fg.sync(files.length ? files : config.include.tzen, {
        ignore: [...config.exclude.tzen],
        cwd,
        absolute: true
      });

      tzenFiles.forEach(tzFilePath => {
        try {
          const tzenFileContent = fs.readFileSync(tzFilePath, { encoding: 'utf-8' });

          fs.writeFileSync(tzFilePath.replace('.tzen', '.ts'), compile(tzenFileContent));
        } catch (e) {
          const cleanFilePath = tzFilePath.replace(cwd, '');

          console.error(`[${cleanFilePath}]: ${e}`);
        }
      });
    });

  cli.help();
  cli.version(version);
  cli.parse(argv, { run: false });
  await cli.runMatchedCommand();
}

function compile(tzenFileContent: string) {
  const ast = new Parser().parse(tzenFileContent);

  if (ast && ast.length !== 0) {
    const compiledResult = new Compiler().compile(ast);

    return compiledResult.toText();
  }

  return '';
}
