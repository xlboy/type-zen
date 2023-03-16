import { merge } from 'lodash-es';
import type { O } from 'ts-toolbelt';

import type { StatementBase } from '../ast/statements/base';
import type { CompiledNode, CompilerConfig } from './types';

export { Compiler, getCurrentCompileConfig, type InnerCompilerConfig };

type InnerCompilerConfig = O.Required<CompilerConfig, string, 'deep'>;

const { getCurrentCompileConfig, setCurrentCompileConfig, defaultConfig } = (() => {
  const defaultConfig: InnerCompilerConfig = Object.freeze({
    indent: 2,
    memberSeparator: ';',
    useLineTerminator: true
  });

  let cachedConfig: InnerCompilerConfig = defaultConfig;
  const getCurrentCompileConfig = () => cachedConfig;
  const setCurrentCompileConfig = (config: InnerCompilerConfig) => {
    cachedConfig = config;
  };

  return { getCurrentCompileConfig, setCurrentCompileConfig, defaultConfig };
})();

class Compiler {
  private readonly config: InnerCompilerConfig;

  constructor(config?: CompilerConfig) {
    this.config = config ? merge({}, defaultConfig, config) : defaultConfig;
  }

  public compile(statements: StatementBase[]) {
    if (this.config) setCurrentCompileConfig(this.config);

    const filteredCompiledNodes = this.filterStatements(statements);

    return {
      toNodes() {
        return filteredCompiledNodes;
      },
      toText() {
        return filteredCompiledNodes.map(cNode => cNode.text).join('');
      }
    };
  }

  /**
   * 过滤的范围： 1. 计算节点位置 2. 根据配置添加分号等
   * @returns 过滤后的、编译后的节点（含位置信息、分号等）
   */
  private filterStatements(statements: StatementBase[]): CompiledNode[] {
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
