import { merge } from 'lodash-es';

import type { StatementBase } from '../ast/statements/base';
import type { CompiledNode, CompilerConfig } from './types';

export { compiler };

class Compiler {
  public config: CompilerConfig = {
    indent: 2,
    memberSeparator: ';',
    useLineTerminator: true
  };

  public compile(statements: StatementBase[]) {
    const filteredCompiledNodes = this.filterCompiledNodes(statements);

    return {
      toNodes() {
        return filteredCompiledNodes;
      },
      toText() {
        return filteredCompiledNodes.map(cNode => cNode.text).join('');
      }
    };
  }

  public updateConfig(config: CompilerConfig) {
    merge(this.config, config);
  }

  /**
   * 过滤的范围： 1. 计算节点位置 2. 根据配置添加分号等
   */
  private filterCompiledNodes(statements: StatementBase[]): CompiledNode[] {
    let currentLine = 1;
    const filteredResult: CompiledNode[] = [];

    for (const stmt of statements) {
      const compiledNodeGroup = stmt.compile();

      for (const compiledNodes of compiledNodeGroup) {
        let currNodeLine = currentLine;
        let currNodeCol = 1;

        for (const cNode of compiledNodes) {
          const endPos = { line: 0, col: 0 };
          const isTextMultiline = cNode.text.includes('\n');

          if (isTextMultiline) {
            const splitTextArr = cNode.text.split('\n');
            const lineNum = splitTextArr.length - 1;

            endPos.line = currNodeLine + lineNum;
            endPos.col = splitTextArr.at(-1)!.length;
          } else {
            endPos.line = currNodeLine;
            endPos.col = currNodeCol + cNode.text.length;
          }

          cNode.pos.result = {
            start: { line: currNodeLine, col: currNodeCol },
            end: endPos
          };

          currNodeCol = endPos.col;
          currNodeLine = endPos.line;

          filteredResult.push(cNode);
        }

        if (this.config.useLineTerminator) {
          filteredResult.push({
            text: ';',
            pos: {
              result: {
                start: { line: currNodeLine, col: currNodeCol },
                end: { line: currNodeLine, col: currNodeCol + 1 }
              }
            }
          });
        }

        filteredResult.push({
          text: '\n',
          pos: {
            result: {
              start: { line: currNodeLine, col: currNodeCol },
              end: { line: ++currNodeLine, col: 1 }
            }
          }
        });

        currentLine = currNodeLine;
      }
    }

    // 删除最后一个换行符
    filteredResult.pop();

    return filteredResult;
  }
}

const compiler = new Compiler();
