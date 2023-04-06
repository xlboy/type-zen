import fs from 'fs';
import { nanoid } from 'nanoid';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { defineConfig } from '../config';
import { TempFileManager, testCLI } from './helpers';

describe('compile specified files', () => {
  it('no glob', async () => {
    const { tempDirPath, tempFileManager } = createTemp();
    const testSource = [
      {
        inputPath: '1.tzen',
        inputContent: `type A = | [string, number];

type C = ^{
  type Name = "x";

  return [Name, number];
}`,
        outputContent: `type A = string | number;\ntype C = ["x"] extends [infer Name] ? [Name, number] : never;`
      },
      {
        inputPath: '2.tzen',
        inputContent: `type D = |[1,2,3,4,5]`,
        outputContent: `type D = 1 | 2 | 3 | 4 | 5;`
      }
    ];

    testSource.forEach(item => tempFileManager.add(item.inputPath, item.inputContent));

    await testCLI(
      tempDirPath,
      testSource.map(item => item.inputPath)
    );

    testSource.forEach(item => {
      const fileContent = fs.readFileSync(
        path.resolve(tempDirPath, `${item.inputPath}.d.ts`),
        'utf-8'
      );

      expect(fileContent).toBe(item.outputContent);
    });

    tempFileManager.destroy();
  });

  it('glob', async () => {
    const { tempDirPath, tempFileManager } = createTemp();

    const testSource = [
      {
        inputPath: '1.test.tzen',
        inputContent: `type A = | [string, number];`,
        outputContent: `type A = string | number;`
      },
      {
        inputPath: '2.test.tzen',
        inputContent: `type D = |[1,2,3,4,5]`,
        outputContent: `type D = 1 | 2 | 3 | 4 | 5;`
      },
      {
        inputPath: '3.tzen',
        inputContent: `type E = true`
      }
    ];

    testSource.forEach(item => tempFileManager.add(item.inputPath, item.inputContent));

    await testCLI(tempDirPath, ['*.test.tzen']);

    testSource.slice(0, 2).forEach(item => {
      const fileContent = fs.readFileSync(
        path.resolve(tempDirPath, `${item.inputPath}.d.ts`),
        'utf-8'
      );

      expect(fileContent).toBe(item.outputContent);
    });

    expect(fs.existsSync(path.resolve(tempDirPath, '3.tzen.d.ts'))).toBe(false);
    tempFileManager.destroy();
  });
});

describe('compile by config', () => {
  it('`include.tzen=[]`, no files should be output', async () => {
    const { tempDirPath, tempFileManager } = createTemp();

    tempFileManager
      .add('tzen.config.json', JSON.stringify(defineConfig({ include: { tzen: [] } })))
      .add('1.tzen', 'type A = 1;')
      .add('2.tzen', 'type B = 2;');

    const oldFileLength = fs.readdirSync(tempDirPath).length;

    await testCLI(tempDirPath);
    const newFileLength = fs.readdirSync(tempDirPath).length;

    expect(newFileLength).toBe(oldFileLength);

    tempFileManager.destroy();
  });

  it('include/exclude files', async () => {
    const { tempDirPath, tempFileManager } = createTemp();

    tempFileManager
      .add(
        'tzen.config.json',
        JSON.stringify(
          defineConfig({
            include: { tzen: ['*.tzen'] },
            exclude: { tzen: ['1.tzen'] }
          })
        )
      )
      .add('1.tzen', 'type A = 1;')
      .add('2.tzen', 'type B = 2;');

    await testCLI(tempDirPath);

    expect(fs.existsSync(path.resolve(tempDirPath, './1.tzen.d.ts'))).toBe(false);
    expect(fs.readFileSync(path.resolve(tempDirPath, './2.tzen.d.ts'), 'utf-8')).toBe(
      'type B = 2;'
    );

    tempFileManager.destroy();
  });

  describe('specify compiler options', () => {
    it('case-1', async () => {
      const { tempDirPath, tempFileManager } = createTemp();

      tempFileManager
        .add(
          'tzen.config.json',
          JSON.stringify(
            defineConfig({
              compiler: {
                output: {
                  format: 'ts',
                  ignoreCheck: true
                }
              }
            })
          )
        )
        .add('1.tzen', 'type A = 1;');

      await testCLI(tempDirPath);

      expect(fs.readFileSync(path.resolve(tempDirPath, './1.tzen.ts'), 'utf-8')).toBe(
        `// @ts-nocheck\ntype A = 1;`
      );

      tempFileManager.destroy();
    });
  });
});

function createTemp() {
  const tempDirName = nanoid();
  const tempDirPath = path.resolve(__dirname, tempDirName);
  const tempFileManager = new TempFileManager(tempDirPath);

  return { tempDirPath, tempDirName, tempFileManager };
}
