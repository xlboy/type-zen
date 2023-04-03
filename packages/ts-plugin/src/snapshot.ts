import fs from 'node:fs';

import type { ASTNodePosition, CompiledNode, exprNode, stmtNode } from '@type-zen/core';
import { Compiler, nodeGuard, Parser } from '@type-zen/core';
import ts from 'typescript/lib/tsserverlibrary';

import type { Logger } from './logger';

export { SnapshotManager };

type TzenFilePath = string & {};

class SnapshotManager {
  private snapshotMap = new Map<TzenFilePath, Snapshot>();
  private ts: typeof ts;
  private logger: Logger;

  constructor(_ts: typeof ts, logger: Logger) {
    this.ts = _ts;
    this.logger = logger;
  }

  getOrCreate(tzenFilePath: string): Snapshot {
    const tzenFileContent = fs.readFileSync(tzenFilePath, 'utf8');

    if (this.snapshotMap.has(tzenFilePath)) {
      const snapshot = this.snapshotMap.get(tzenFilePath)!;

      if (snapshot.tzenCode === tzenFileContent) {
        return snapshot;
      } else {
        snapshot.updateTzenCode(tzenFileContent);

        return snapshot;
      }
    }

    const snapshot = new Snapshot(tzenFileContent, tzenFilePath, this.ts, this.logger);

    this.snapshotMap.set(tzenFilePath, snapshot);

    return snapshot;
  }

  update(filePath: string, snapshot: Snapshot): void {
    this.snapshotMap.set(filePath, snapshot);
  }
}

class Snapshot {
  private ast: stmtNode.StatementBase[] = [];
  private compiled: { nodes: CompiledNode[]; code: string } = {
    nodes: [],
    code: ''
  };
  private ts: typeof ts;
  private logger: Logger;
  private tzenFilePath: string;

  tzenCode = '';

  constructor(tzenCode: string, tzenFilePath: string, _ts: typeof ts, logger: Logger) {
    this.tzenCode = tzenCode;
    this.tzenFilePath = tzenFilePath;
    this.ts = _ts;
    this.logger = logger;
    this.init();
  }

  updateTzenCode(tzenCode: string): void {
    this.tzenCode = tzenCode;
    this.init();
  }

  getScriptSnapshot(): ts.IScriptSnapshot {
    return this.ts.ScriptSnapshot.fromString(this.compiled.code + ';export {}');
  }

  getQuickInfo(line: number, col: number): ts.QuickInfo | undefined {
    const foundCompiledNode = this.utils.findCompiledNodeAtPos(line, col);

    if (!foundCompiledNode) return;
    if (!foundCompiledNode.pos.source) return;

    const foundStmtNode = this.utils.findStmtNodeAtSourcePos(
      foundCompiledNode.pos.source
    );

    if (!foundStmtNode) return;

    const scoped = (() => {
      let stmtNode = foundStmtNode;

      if (nodeGuard.statement.isExportNamed(foundStmtNode)) {
        stmtNode = foundStmtNode.body;
      }

      const compiledCode = new Compiler().compile([stmtNode]).toText();
      const tzenCode = this.tzenCode.substring(
        this.utils.getIndexFromLineAndCol(
          this.tzenCode,
          stmtNode.pos.start.line,
          stmtNode.pos.start.col
        ),
        this.utils.getIndexFromLineAndCol(
          this.tzenCode,
          stmtNode.pos.end.line,
          stmtNode.pos.end.col
        )
      );

      return { compiledCode, tzenCode };
    })();

    return {
      kind: ts.ScriptElementKind.alias,
      kindModifiers: ts.ScriptElementKindModifier.none,
      textSpan: { start: 0, length: 0 },
      documentation: [
        { text: createOutput(scoped.tzenCode, scoped.compiledCode), kind: 'text' }
      ]
    };

    function createOutput(tzenCode: string, compiledCode: string) {
      const mdContent = `
**TypeZen Code:**
\`\`\`ts
${tzenCode}
\`\`\`
---
**Compiled Code:**
\`\`\`ts
${compiledCode}
\`\`\`
`;

      return ts.displayPartsToString([{ text: mdContent, kind: 'markdown' }]);
    }
  }

  getDefinitionAndBoundSpan(
    line: number,
    col: number
  ): Required<ts.DefinitionInfoAndBoundSpan> | undefined {
    const foundCompiledNode = this.utils.findCompiledNodeAtPos(line, col);

    if (!foundCompiledNode) return;
    if (!foundCompiledNode.pos.source) return;

    const foundStmtNode = this.utils.findStmtNodeAtSourcePos(
      foundCompiledNode.pos.source
    );

    if (!foundStmtNode) return;

    const scopedPos = (() => {
      let identifierNode!: exprNode.ExpressionBase;

      if (nodeGuard.statement.isExportNamed(foundStmtNode)) {
        identifierNode = (foundStmtNode.body as any).name;
      } else if (nodeGuard.statement.isTypeAlias(foundStmtNode)) {
        identifierNode = foundStmtNode.name;
      }

      return {
        line: identifierNode.pos.start.line,
        col: identifierNode.pos.start.col
      };
    })();

    const textSpan = {
      start: this.utils.getIndexFromLineAndCol(
        this.tzenCode,
        scopedPos.line,
        scopedPos.col
      ),
      length: foundCompiledNode.text.length
    };

    return {
      definitions: [
        {
          fileName: this.tzenFilePath,
          name: foundCompiledNode.text,
          containerKind: ts.ScriptElementKind.unknown,
          containerName: '',
          kind: ts.ScriptElementKind.unknown,
          // textSpan,
          // 暂时使用 0,0 代替…上面的 textSpan 会令 LanguageService 无法准确跳转（但 textSpan 的数据是准确的）
          // 之所以无法精准跳转，可能是因为 SciprtSnapshot(tzen -> ts), ... 等的问题。还需研究…T_T
          // 但是如果使用 0,0 的话，SciprtSnapshot 会把光标定位到文件的开头（暂时性的默认行为）
          textSpan: { start: 0, length: 0 }
        }
      ],
      textSpan: { start: 0, length: 0 }
    };
  }

  private init() {
    const parser = new Parser();
    const compiler = new Compiler();

    if (this.tzenCode) {
      const ast = parser.parse(this.tzenCode);

      if (ast && ast.length > 0) {
        this.ast = ast;
        const compiled = compiler.compile(ast);

        this.compiled = {
          nodes: compiled.toNodes(),
          code: compiled.toText()
        };
      } else {
        this.ast = [];
        this.compiled = { nodes: [], code: '' };
      }
    } else {
      this.ast = [];
      this.compiled = { nodes: [], code: '' };
    }
  }

  private utils = {
    getIndexFromLineAndCol(str: string, line: number, col: number): number {
      const lines = str.split('\n');
      let index = 0;

      for (let i = 0; i < line - 1; i++) {
        index += lines[i].length + 1;
      }

      index += col - 1;

      return index;
    },
    findCompiledNodeAtPos: (line: number, col: number) => {
      return this.compiled.nodes.find(node => {
        const pos = node.pos.result!;

        return (
          line >= pos.start.line &&
          line <= pos.end.line &&
          col === pos.start.col &&
          col < pos.end.col
        );
      });
    },
    findStmtNodeAtSourcePos: (sourcePos: ASTNodePosition) => {
      return this.ast.find(stmt => {
        const inRange = (() => {
          if (stmt.pos.start.line === sourcePos.start.line) {
            if (stmt.pos.end.line > sourcePos.end.line) {
              return true;
            } else if (stmt.pos.end.line === sourcePos.end.line) {
              return (
                sourcePos.start.col >= stmt.pos.start.col &&
                sourcePos.end.col <= stmt.pos.end.col
              );
            }
          }

          if (sourcePos.start.line > stmt.pos.start.line) {
            if (sourcePos.end.line < stmt.pos.end.line) {
              return true;
            }

            if (sourcePos.end.line === stmt.pos.end.line) {
              return (
                sourcePos.start.col >= stmt.pos.start.col &&
                sourcePos.end.col <= stmt.pos.end.col
              );
            }
          }

          return false;
        })();

        return inRange;
      });
    }
  };
}
