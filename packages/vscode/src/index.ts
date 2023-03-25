import vscode from 'vscode';

import { version } from '../package.json';
import { compileCurrentFileCmdHandler } from './core/comman-handler/compile-current-file';
import { Config } from './core/config';
import { log } from './core/log';
import { UntitledWindowContext } from './core/window';

export function activate(context: vscode.ExtensionContext) {
  log.default.appendLine(`TypeZen for VS Code v${version}\n`);
  if (!Config.i.get().enabled) {
    log.default.appendLine('Extension disabled, exiting...');

    return;
  }

  UntitledWindowContext.init(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('typezen.newTypeZenFile', () => {
      UntitledWindowContext.i.create();
    }),
    vscode.commands.registerCommand(
      'typezen.compileCurrentFile',
      compileCurrentFileCmdHandler
    )
  );
}
