import fs from 'fs';
import path from 'path';
import { expect, it } from 'vitest';

import { startCLI } from '../cli';

const testCwd = path.resolve(__dirname, './res/');

it('Compile specified files', async () => {
  const fileInfos = [
    {
      inputPath: './1.tzen',
      outputPath: path.resolve(testCwd, './1.ts'),
      outputContent: `type A = string | number;\ntype C = ["x"] extends [infer Name] ? [Name, number] : never;`
    },
    {
      inputPath: './2.tzen',
      outputPath: path.resolve(testCwd, './2.ts'),
      outputContent: `type D = 1 | 2 | 3 | 4 | 5;`
    }
  ];

  await testCLI(fileInfos.map(item => item.inputPath));

  fileInfos.forEach(item => {
    expect(fs.readFileSync(item.outputPath, 'utf-8')).toBe(item.outputContent);
    fs.unlinkSync(item.outputPath);
  });
});

it('Compile by config', async () => {
  const oldFileLength = fs.readdirSync(testCwd).length;

  await testCLI(['-c', './tzen.config.ts']);
  const newFileLength = fs.readdirSync(testCwd).length;

  expect(newFileLength).toBe(oldFileLength);
});

function testCLI(argv: string[]) {
  return startCLI(testCwd, ['', '', ...argv]);
}
