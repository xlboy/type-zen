import vscode from 'vscode';

import { log } from '../log';
import { compileCurrentFileCmdHandler } from './compile-current-file';

export function registerCommand(vscodeContext: vscode.ExtensionContext) {
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
