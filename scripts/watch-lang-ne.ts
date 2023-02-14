import watch from "node-watch";
import { exec } from "child_process";

function build() {
  exec("pnpm build:ne", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

build();

watch("src/grammar/", { recursive: true, filter: /.ne$/ }, (evt, name) => {
  build();
});
