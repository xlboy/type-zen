import { customAlphabet } from 'nanoid';
import zod from 'zod';

import type { CompiledNode } from '../../../compiler';
import type { ASTNodePosition } from '../..';
import type { ASTBase } from '../../base';
import { SyntaxKind } from '../../constants';
import { Object } from '../../expressions/object';
import { TypeReferenceExpression } from '../../expressions/type-reference';
import { TopLevelStatementBase } from '../top-level/base';
import { DeclareFunctionStatement } from '../top-level/declare-function';
import { DeclareVariableStatement } from '../top-level/declare-variable';
import { TypeAliasStatement } from '../top-level/type-alias';
import { NormalStatementBase } from './base';
import { ReturnStatement } from './return';

export { SugarBlockStatement };

const schema = zod.tuple([
  zod.any() /* { */,
  zod.array(
    zod
      .instanceof(TypeAliasStatement)
      // TODO：  循环引用…
      .or(zod.custom<ASTBase>((data: any) => data.kind === SyntaxKind.S.If))
      .or(zod.instanceof(ReturnStatement))
  ),
  zod.any() /* } */
]);

type Schema = zod.infer<typeof schema>;

class SugarBlockStatement extends NormalStatementBase {
  public kind = SyntaxKind.S.SugarBlock;

  public statements: Schema[1];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.statements] = args;
  }

  public compile() {
    const compileChain = this.compileUtils.getChain();
    const rootNodeFlow = this.compileUtils.createNodeFlow();
    let insideNodeFlow = rootNodeFlow;

    let localVarNames: CompiledNode[][] = [];
    let localVarProcessing = false;

    let currentSpaceName = '';

    for (let i = 0; i < this.statements.length; i++) {
      const stmt = this.statements[i];
      const isLast = i === this.statements.length - 1;

      if (this.shouldHoistStatement(stmt)) {
        const [topLevelStmt] = compileChain;

        if (topLevelStmt instanceof TopLevelStatementBase) {
          if (stmt instanceof TypeAliasStatement) {
            const outputName = `$_${this.getCompilePath()}_${
              stmt.name.value
            }__${this.generateRandomName()}`;
            const nodeFlowToHoist = this.compileUtils
              .createNodeFlow('type ')
              .add(outputName, stmt.name.pos)
              .add(stmt.arguments!.compile())
              .add(' = ')
              .add(stmt.value.compile())
              .add('\n');

            topLevelStmt.prependCompiledNode(nodeFlowToHoist.get());
          }
        } else {
          throw new Error('topLevelStmt is not TopLevelStatementBase');
        }
      } else {
        // 在非“提升语句”中遇到了“局部变量声名语句 ”
        if (stmt instanceof TypeAliasStatement) {
          if (!localVarProcessing) {
            localVarProcessing = true;
            insideNodeFlow.add('[').add(stmt.value.compile());
          } else {
            insideNodeFlow.add(', ').add(stmt.value.compile());
          }

          localVarNames.push(stmt.name.compile());
        } else {
          if (localVarProcessing) {
            insideNodeFlow.add(']').add(' extends ').add('[');

            for (let i = 0; i < localVarNames.length; i++) {
              if (i !== 0) {
                insideNodeFlow.add(', ');
              }

              insideNodeFlow.add('infer ').add(localVarNames[i]);
            }

            insideNodeFlow.add(']').add(' ? ');
            insideNodeFlow.createSpace((currentSpaceName = this.generateRandomName()));

            insideNodeFlow.add(' : ').add('never');
            localVarNames = [];
            localVarProcessing = false;
          }

          insideNodeFlow = currentSpaceName
            ? insideNodeFlow.getSpace(currentSpaceName)
            : insideNodeFlow;

          // 这里的 stmt，一般为 if, for
          const compiltedNodes: CompiledNode[] = stmt.compile();

          // 如果是最后一个结果，那么就不需要包装了（之所以要包装是因为“下一个执行流需要上一个执行流的结果来决定是否执行”）
          if (isLast) {
            insideNodeFlow.add(compiltedNodes);
          } else {
            currentSpaceName = this.generateRandomName();
            this.compiledNodesWrapper(insideNodeFlow, compiltedNodes, currentSpaceName);
          }
        }
      }
    }

    return rootNodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }

  private shouldHoistStatement(stmt: Schema[number]) {
    if (stmt instanceof TypeAliasStatement) {
      if (stmt.arguments) {
        return true;
      }
    }

    return false;
  }

  private getCompilePath() {
    const compileChain = this.compileUtils.getChain();
    let path = '';

    for (const node of compileChain) {
      if (
        node instanceof TypeAliasStatement ||
        node instanceof DeclareFunctionStatement ||
        node instanceof DeclareVariableStatement ||
        node instanceof TypeReferenceExpression ||
        node instanceof Object.Content.IndexSignatureExpression ||
        node instanceof Object.Content.MethodExpression ||
        node instanceof Object.Content.NormalExpression ||
        node instanceof Object.Content.MappedExpression
      ) {
        path += node.name.value + '_';
      } else if (node instanceof Object.Content.LiteralIndexExpression) {
        path += node.literalName.value + '_';
      } else {
        path += node.kind + '_';
      }
    }

    return path;
  }

  //  对“编译好的节点”进行包装，比如： if块
  //  “if块” 代表着一个“结果”，这个结果会影响上下文的执行流
  // 每往下走一个“执行”，都需要根据上文的“结果”（if块的结果）来决定是否执行
  private compiledNodesWrapper(
    flow: ReturnType<typeof this.compileUtils.createNodeFlow>,
    compiledNodes: CompiledNode[],
    spaceName: string
  ) {
    const nameOfCompiledNodes = this.generateRandomName();

    //  (表达式) extends infer 当前结果 ? 当前结果 extends 未返回符号 ？ 未返回符号 : 当前结果 : never
    flow
      .add('(')
      .add(compiledNodes)
      .add(`)`)
      .add(' extends ')
      .add(`infer ${nameOfCompiledNodes}`)
      .add(' ? ')
      .add(nameOfCompiledNodes)
      .add(' extends ')
      .add(this.compileUtils.getConstants().UnreturnedSymbol)
      .add(' ? ')
      .createSpace(spaceName);

    flow.add(' : ').add(nameOfCompiledNodes).add(' : ').add('never');
  }

  private generateRandomName() {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz');

    return 'r_' + nanoid(5);
  }
}
