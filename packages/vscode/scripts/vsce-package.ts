import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

async function main(toPublish: boolean) {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const rawJSON = await fs.readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(rawJSON);

  pkg.name = 'TypeZen';

  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
  try {
    if (toPublish) {
      await execa(
        'vsce',
        ['publish', '--no-dependencies', '-p', process.env.VSCE_TOKEN!],
        { stdio: 'inherit' }
      );
    } else {
      await execa('vsce', ['package', '--no-dependencies'], { stdio: 'inherit' });
    }
  } finally {
    await fs.writeFile(pkgPath, rawJSON, 'utf-8');
  }
}

const args = process.argv.slice(2);
const toPublish = args.includes('--publish');

main(toPublish);
