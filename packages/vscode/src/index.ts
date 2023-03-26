import type vscode from 'vscode';

import { version } from '../package.json';
import { registerCommand } from './core/command';
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
  registerCommand(vscodeContext);
}
