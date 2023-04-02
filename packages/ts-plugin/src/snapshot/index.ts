import fs from 'node:fs';

import type { CompiledNode, stmtNode } from '@type-zen/core';
import { Compiler, nodeGuard, Parser } from '@type-zen/core';
import ts from 'typescript/lib/tsserverlibrary';

import type { Logger } from '../logger';

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

    const snapshot = new Snapshot(tzenFileContent, this.ts, this.logger);

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
  tzenCode = '';
  private ts: typeof ts;
  private logger: Logger;

  constructor(tzenCode: string, _ts: typeof ts, logger: Logger) {
    this.tzenCode = tzenCode;
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
    const foundCompiledNode = this.compiled.nodes.find(node => {
      const pos = node.pos.result!;

      return (
        line >= pos.start.line &&
        line <= pos.end.line &&
        col === pos.start.col &&
        col < pos.end.col
      );
    });

    if (!foundCompiledNode) return;

    const foundStmtNode = this.ast.find(stmt => {
      const inRange = (() => {
        const nodeSLine = foundCompiledNode.pos.source!.start.line;
        const nodeELine = foundCompiledNode.pos.source!.end.line;
        const nodeSCol = foundCompiledNode.pos.source!.start.col;
        const nodeECol = foundCompiledNode.pos.source!.end.col;
        const stmtSLine = stmt.pos.start.line;
        const stmtELine = stmt.pos.end.line;
        const stmtSCol = stmt.pos.start.col;
        const stmtECol = stmt.pos.end.col;

        if (stmtSLine === nodeSLine) {
          if (stmtELine > nodeELine) {
            return true;
          } else if (stmtELine === nodeELine) {
            return nodeSCol >= stmtSCol && nodeECol <= stmtECol;
          }
        }

        if (nodeSLine > stmtSLine) {
          if (nodeELine < stmtELine) {
            return true;
          }

          if (nodeELine === stmtELine) {
            return nodeSCol >= stmtSCol && nodeECol <= stmtECol;
          }
        }

        return false;
      })();

      return inRange;
    });

    if (!foundStmtNode) return;

    const scoped = (() => {
      let stmtNode = foundStmtNode;

      if (nodeGuard.statement.isExportNamed(foundStmtNode)) {
        stmtNode = foundStmtNode.body;
      }

      const compiledCode = new Compiler().compile([stmtNode]).toText();
      const tzenCode = this.tzenCode.substring(
        getIndexFromLineAndCol(
          this.tzenCode,
          stmtNode.pos.start.line,
          stmtNode.pos.start.col
        ),
        getIndexFromLineAndCol(this.tzenCode, stmtNode.pos.end.line, stmtNode.pos.end.col)
      );

      return { compiledCode, tzenCode };
    })();

    return {
      kind: ts.ScriptElementKind.string,
      kindModifiers: ts.ScriptElementKindModifier.none,
      textSpan: { start: 0, length: 0 },
      documentation: [
        { text: createOutput(scoped.tzenCode, scoped.compiledCode), kind: 'text' }
      ]
    };

    function getIndexFromLineAndCol(str: string, line: number, col: number): number {
      const lines = str.split('\n');
      let index = 0;

      for (let i = 0; i < line - 1; i++) {
        index += lines[i].length + 1;
      }

      index += col - 1;

      return index;
    }

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
        this.compiled = {
          nodes: [],
          code: ''
        };
      }
    } else {
      this.ast = [];
      this.compiled = {
        nodes: [],
        code: ''
      };
    }
  }
}
