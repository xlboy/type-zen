import { exec } from 'child_process';
import watch from 'node-watch';

function build() {
  exec('pnpm ne:build', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);

      return;
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    console.log(`\ntime: ${new Date().toLocaleTimeString()}\n`);
  });
}

build();

watch('src/grammar/', { recursive: true, filter: /.ne$/ }, (evt, name) => {
  build();
});
