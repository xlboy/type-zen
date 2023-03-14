import fs from 'node:fs';

import { compiler, Parser } from '@type-zen/core';
import cac from 'cac';
import fg from 'fast-glob';

import { version } from '../package.json';
import { loadConfigFromFile } from './config';

const VERSION = version as string;

const cli = cac('tzc');

cli.help();
cli.version(VERSION);

cli.command('build', 'build type-zen').option('-c, --config <file>', `[string] 配置文件地址`).action(async (options: { config: string }) => {
  const config = await loadConfigFromFile('tzc.config', options?.config);

  if (config) {
    const { include, exclude } = config;

    const tzenFileList = fg.sync([...include.tzen], {
      ignore: [...exclude.tzen, '**/node_modules/**']
    });

    tzenFileList.forEach(key => {
      try {
        const ast = new Parser(fs.readFileSync(key, { encoding: 'utf-8' })).toAST();
        if (ast.length !== 0) {
          const compiledResult = compiler.compile(ast);
          fs.writeFileSync(key.replace(".tzen",".ts"), compiledResult.toText())
        }
      } catch(e) {
        console.log(e)
      }
    });
  }
});

cli.parse();
