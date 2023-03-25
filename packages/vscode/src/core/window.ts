import * as vscode from 'vscode';

import { log } from './log';
import { compile } from './utils';

export { UntitledWindowContext };

type TypeZenTextEditor = vscode.TextEditor;

class UntitledWindowContext {
  private static _instance: UntitledWindowContext;

  /** instance */
  public static get i(): UntitledWindowContext {
    if (!UntitledWindowContext._instance) {
      throw new Error('UntitledWindowContext not initialized');
    }

    return UntitledWindowContext._instance;
  }
  public static init(context: vscode.ExtensionContext) {
    UntitledWindowContext._instance = new UntitledWindowContext(context);
  }

  private _context: vscode.ExtensionContext;
  private _editors: TypeZenTextEditor[] = [];

  private constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._watch();
  }

  public create() {
    vscode.workspace.openTextDocument({ language: 'TypeZen' }).then(doc => {
      vscode.window.showTextDocument(doc, vscode.ViewColumn.One).then(editor => {
        this._editors.push(editor);
      });
    });
    log.compile.clear();
    log.compile.show(true);
  }

  private _watch() {
    vscode.workspace.onDidCloseTextDocument(doc => {
      if (doc.isUntitled) {
        this._editors = this._editors.filter(e => e.document !== doc);
      }
    });

    vscode.workspace.onDidChangeTextDocument(event => {
      const doc = event.document;

      if (doc.isUntitled) {
        const editor = this._editors.find(e => e.document === doc);

        if (editor) {
          compile(editor);
        }
      }
    });
  }
}
