import vscode from 'vscode';

import { version } from '../package.json';
import { compileCurrentFileCmdHandler } from './core/comman-handler/compile-current-file';
import { Config } from './core/config';
import { EditorContext } from './core/editor-context';
import { log } from './core/log';

export function activate(vscodeContext: vscode.ExtensionContext) {
  log.default.appendLine(`TypeZen for VS Code v${version}\n`);
  if (!Config.i.get().enabled) {
    log.default.appendLine('Extension disabled, exiting...');

    return;
  }

  EditorContext.init(vscodeContext);

  vscodeContext.subscriptions.push(
    vscode.commands.registerCommand('typezen.newTypeZenFile', () => {
      vscode.workspace.openTextDocument({ language: 'TypeZen' }).then(doc => {
        vscode.window.showTextDocument(doc, vscode.ViewColumn.One);
      });
      log.compile.clear();
      log.compile.show(true);
    }),
    vscode.commands.registerCommand(
      'typezen.compileCurrentFile',
      compileCurrentFileCmdHandler
    )
  );
}
