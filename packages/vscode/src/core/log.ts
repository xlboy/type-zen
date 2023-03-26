import vscode from 'vscode';

const defaultLog = vscode.window.createOutputChannel('TypeZen');
const compileLog = vscode.window.createOutputChannel('TypeZen Compile', 'typescript');

export const log = {
  default: defaultLog,
  compile: compileLog
};
