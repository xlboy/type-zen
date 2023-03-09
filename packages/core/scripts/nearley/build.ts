import { exec } from 'child_process';
import { replaceInFileSync } from 'replace-in-file';

export function build() {
  const outputPath = 'src/grammar/__lang.auto-generated__.ts';

  exec(
    `nearleyc src/grammar/nearley-bnf/index.ne -o ${outputPath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);

        return;
      }

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      console.log(`\ntime: ${new Date().toLocaleTimeString()}\n`);

      replaceInFileSync({
        files: outputPath,
        from: /^/,
        to: '// @ts-nocheck\n\n'
      });
      exec(`eslint ${outputPath} --fix`);
    }
  );
}

build();
