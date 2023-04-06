import fs from 'fs-extra';
import path from 'path';

import { startCLI } from '../cli';

export function testCLI(cwd: string, argv: string[] = []) {
  return startCLI(cwd, ['', '', ...argv]);
}

export class TempFileManager {
  private files = new Map</* relativePath */ string, /* content */ string>();

  constructor(private tempDirPath: string) {}

  add(relativePath: string, content: string) {
    this.files.set(relativePath, content);

    fs.ensureDirSync(this.tempDirPath);
    fs.writeFileSync(path.resolve(this.tempDirPath, relativePath), content);

    return this;
  }

  destroy() {
    fs.removeSync(this.tempDirPath);
  }
}
