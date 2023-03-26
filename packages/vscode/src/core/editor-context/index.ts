import { Compiler, Parser } from '@type-zen/core';
import type { ReadonlyDeep } from 'type-fest';
import * as vscode from 'vscode';

import { tsTypeAnalyzer } from '../utils/ts-type-analyzer';
import type { EditorInfo } from './types';

export { EditorContext };

const errorDecorationType = vscode.window.createTextEditorDecorationType({
  textDecoration: 'wavy underline red',
  overviewRulerColor: 'red',
  overviewRulerLane: vscode.OverviewRulerLane.Right
});

class EditorContext {
  private static _instance: EditorContext;

  /** instance */
  public static get i(): EditorContext {
    if (!EditorContext._instance) {
      throw new Error('EditorContext not initialized');
    }

    return EditorContext._instance;
  }
  public static init(vscodeContext: vscode.ExtensionContext) {
    EditorContext._instance = new EditorContext(vscodeContext);
  }

  private vscodeContext: vscode.ExtensionContext;
  private editors = new Map<vscode.TextEditor, EditorInfo>();

  private constructor(vscodeContext: vscode.ExtensionContext) {
    this.vscodeContext = vscodeContext;
    this.watch();
    this.initVisibleEditors();
  }

  public getEditorInfo(editor: vscode.TextEditor): ReadonlyDeep<EditorInfo> | undefined {
    return this.editors.get(editor);
  }

  private watch() {
    vscode.workspace.onDidCloseTextDocument(doc => {
      this.editors.forEach((_, editor) => {
        if (editor.document === doc) {
          this.editors.delete(editor);
        }
      });
    });

    vscode.workspace.onDidChangeTextDocument(event => {
      this.editors.forEach((info, editor) => {
        if (editor.document === event.document) {
          this.updateEditorInfo(editor);
          this.updateEditorDecorations(editor);
        }
      });
    });

    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor && editor.document.languageId === 'TypeZen') {
        if (!this.editors.has(editor)) {
          this.editors.set(editor, this.utils.getInitialEditorInfo(editor));
          this.updateEditorInfo(editor);
          this.updateEditorDecorations(editor);
        }
      }
    });

    vscode.languages.registerHoverProvider('TypeZen', {
      provideHover: (_, position) => this.hoverProvider(position)
    });
  }

  private initVisibleEditors() {
    vscode.window.visibleTextEditors.forEach(editor => {
      if (editor.document.languageId === 'TypeZen') {
        this.editors.set(editor, this.utils.getInitialEditorInfo(editor));
        this.updateEditorInfo(editor);
        this.updateEditorDecorations(editor);
      }
    });
  }

  private updateEditorInfo(editor: vscode.TextEditor) {
    const info = this.editors.get(editor)!;

    const resetMainInfo = () => {
      info.compiled = null;
      info.analyzedTSInfo = null;
      info.nearleyErrorInfos = [];
    };

    info.code = editor.document.getText();
    if (info.code === '') {
      resetMainInfo();
    } else {
      try {
        const ast = new Parser().parse(info.code);

        if (ast && ast.length !== 0) {
          const compiledResult = new Compiler().compile(ast);

          info.compiled = {
            nodes: compiledResult.toNodes(),
            tsCode: compiledResult.toText()
          };
          removeUselessNearleyErrorInfo();
          updateAnalyzedTSInfo();
        } else {
          resetMainInfo();
        }
      } catch (error: any) {
        resetMainInfo();
        console.log(error.message);
        if (isNearleyError(error)) {
          handleNearleyError(error);
        }
      }
    }

    this.editors.set(editor, info);

    return;

    function updateAnalyzedTSInfo() {
      // const diagnostics = tsTypeAnalyzer.getDiagnostics(info.compiled!.tsCode);
      // const diagnostics = tsTypeAnalyzer.getTypeAtPosition(info.compiled!.tsCode);
      // info.analyzedTSInfo ??= {
      //   errors: [],
      //   typeResult: []
      // };
    }

    function removeUselessNearleyErrorInfo() {
      info.nearleyErrorInfos = info.nearleyErrorInfos.filter(errorInfo => {
        const { line: errorLine, col: errorCol } = errorInfo.pos.start;
        const noError = info.compiled!.nodes.some(({ pos }) => {
          if (Number(pos.source?.start.line) > errorLine) {
            return true;
          }

          if (
            Number(pos.source?.start.line) === errorLine &&
            Number(pos.source?.start.col) >= errorCol
          ) {
            return true;
          }

          return false;
        });

        if (noError) {
          return false;
        } else {
          const lastSourceNodePos = [...info.compiled!.nodes]
            .reverse()
            .find(({ pos }) => pos.source)!.pos;

          if (errorLine > Number(lastSourceNodePos.source?.start.line)) {
            return false;
          } else if (
            errorLine === Number(lastSourceNodePos.source?.start.line) &&
            errorCol >= Number(lastSourceNodePos.source?.start.col)
          ) {
            return false;
          }
        }

        return true;
      });
    }

    function handleNearleyError(error: any) {
      const hasErrorInfo = info.nearleyErrorInfos.some(errorInfo => {
        return (
          errorInfo.pos.start.line === error.line && errorInfo.pos.start.col === error.col
        );
      });

      if (!hasErrorInfo) {
        info.nearleyErrorInfos.push({
          pos: {
            start: { line: error.line, col: error.col },
            end: { line: error.line, col: error.col + 1 }
          },
          message: error.message
        });
      }
    }

    function isNearleyError(error: any) {
      return 'col' in error && 'line' in error && 'message' in error;
    }
  }

  private updateEditorDecorations(editor: vscode.TextEditor) {
    const info = this.editors.get(editor)!;

    const errorDecorations: vscode.DecorationOptions[] = [];

    info.nearleyErrorInfos.forEach(errorInfo => {
      const { line, col } = errorInfo.pos.start;

      const startPos = new vscode.Position(line - 1, col - 1);
      const endPos = new vscode.Position(line - 1, col);

      errorDecorations.push({
        range: new vscode.Range(startPos, endPos),
        hoverMessage: new vscode.MarkdownString(`**Error:** s${errorInfo.message}`)
      });
    });

    editor.setDecorations(errorDecorationType, errorDecorations);
  }

  private hoverProvider(position: vscode.Position) {
    const activedEditor = vscode.window.activeTextEditor!;
    const editor = this.editors.get(activedEditor);

    if (activedEditor && editor) {
      if (editor.compiled) {
        const currentHoverPos = {
          line: position.line + 1,
          col: position.character + 1
        };

        const foundNode = editor.compiled.nodes.find(n => {
          if (!n.pos.source) return false;

          if (n.pos.source.start.line === currentHoverPos.line) {
            if (
              n.pos.source.start.col <= currentHoverPos.col &&
              n.pos.source.end.col >= currentHoverPos.col
            ) {
              return true;
            }
          } else if (n.pos.source.start.line < currentHoverPos.line) {
            if (n.pos.source.end.line > currentHoverPos.line) {
              return true;
            } else if (n.pos.source.end.line === currentHoverPos.line) {
              if (n.pos.source.end.col >= currentHoverPos.col) {
                return true;
              }
            }
          }

          return false;
        });

        if (foundNode) {
          const type = tsTypeAnalyzer.getTypeAtPosition(
            editor.compiled.tsCode,
            foundNode.pos.result!.start.line,
            foundNode.pos.result!.start.col
          );

          if (type) {
            return new vscode.Hover('```typescript\n' + type + '\n```');
          }
        }
      }
    }
  }

  private utils = {
    getInitialEditorInfo(editor: vscode.TextEditor): EditorInfo {
      return {
        isUntitled: editor.document.isUntitled,
        code: '',
        compiled: null,
        analyzedTSInfo: null,
        nearleyErrorInfos: []
      };
    }
  };
}
