import path from 'node:path';

import cac from 'cac';
import chokidar from 'chokidar';
import * as colorette from 'colorette';
import consola from 'consola';
import fg from 'fast-glob';

import { version } from '../package.json';
import { loadConfig } from './config';
import { output } from './helpers';

export { startCLI };

interface Options {
  config?: string;
  watch?: boolean;
}

async function startCLI(cwd = process.cwd(), argv = process.argv) {
  const cli = cac('tzc');

  cli
    .command('[...files]', 'TypeZen file, Supports glob patterns')
    .option('-c, --config [path]', '[string] Config file')
    .option('-w, --watch', 'Enable watch mode')
    .action(async (files: string[], options: Options) => {
      const { config, filePath: configFilePath } = await loadConfig({
        configPath: options.config,
        cwd
      });

      if (options.watch) {
        config.watch = true;
      }

      if (configFilePath) {
        consola.info(
          `Using config file: ${colorette.blue(path.relative(cwd, configFilePath))}`
        );
      }

      if (config.watch) {
        consola.info('Watch mode enabled');
      }

      const tzenFilePatterns = files.length ? files : config.include.tzen;

      fg.sync(tzenFilePatterns, {
        ignore: [...config.exclude.tzen],
        cwd,
        absolute: true
      }).forEach(tzenFilePath => output({ config, cwd, tzenFilePath }));

      if (config.watch) {
        chokidar
          .watch(tzenFilePatterns, {
            ignoreInitial: true,
            cwd,
            ignorePermissionErrors: true
          })
          .on('all', (type, filePath) => {
            switch (type) {
              case 'unlink':
              case 'unlinkDir':
              case 'addDir':
                return;

              case 'change': {
                consola.info(`File ${colorette.blue(filePath)} changed`);
                break;
              }

              case 'add': {
                consola.info(`File ${colorette.blue(filePath)} added`);
                break;
              }
            }

            output({ config, cwd, tzenFilePath: filePath });
          });
      }
    });

  cli.help();
  cli.version(version);
  cli.parse(argv, { run: false });
  await cli.runMatchedCommand();
}
