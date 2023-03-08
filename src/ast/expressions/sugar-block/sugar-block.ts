import zod from 'zod';

import { ASTNodePosition } from '../..';
import type { CompiledNode } from '../../../compiler';
import { SyntaxKind } from '../../constants';
import { Object } from '../../expressions/object';
import { TypeReferenceExpression } from '../../expressions/type-reference';
import { StatementBase } from '../../statements/base';
import { DeclareFunctionStatement } from '../../statements/declare-function';
import { DeclareVariableStatement } from '../../statements/declare-variable';
import { TypeAliasStatement } from '../../statements/type-alias';
import { ExpressionBase } from '../base';
import type { SugarBlockIfExpression } from './if';
import { SugarBlockReturnExpression } from './return';

export { SugarBlockExpression };

const schema = zod.tuple([
  zod.any() /* { */,
  zod.array(
    zod
      .instanceof(TypeAliasStatement)
      .or(
        zod.custom<SugarBlockIfExpression>(
          (data: any) => data.kind === SyntaxKind.E.SugarBlockIf
        )
      )
      .or(zod.instanceof(SugarBlockReturnExpression))
  ),
  zod.any() /* } */
]);

type Schema = zod.infer<typeof schema>;

class SugarBlockExpression extends ExpressionBase {
  public kind = SyntaxKind.E.SugarBlock;

  public statements: Schema[1];

  public toHoistIdentifierMap = new Map<
    /* Origin Name */ string,
    /* Output Name */ string
  >();

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
      const isLastStmt = i === this.statements.length - 1;

      if (this.shouldHoistStatement(stmt)) {
        handleStatementHoist.call(this, stmt);
      } else {
        const isTypeAliasStmt = stmt instanceof TypeAliasStatement;

        handleLocalVar.call(this, stmt);

        if (!isTypeAliasStmt) {
          insideNodeFlow = currentSpaceName
            ? insideNodeFlow.getSpace(currentSpaceName)
            : insideNodeFlow;

          const currentLogicalNodes = stmt.compile();

          // 如果是最后一个结果，那么就不需要包装了（之所以要包装是因为“下一个执行流需要上一个执行流（逻辑块）的结果来决定是否执行”）
          if (isLastStmt) {
            insideNodeFlow.add(currentLogicalNodes);
          } else {
            currentSpaceName = this.compileUtils.generateRandomName();
            this.executionFlowWrapper(
              insideNodeFlow,
              currentLogicalNodes,
              currentSpaceName
            );
          }
        }
      }
    }

    return rootNodeFlow.get();

    function handleStatementHoist(
      this: SugarBlockExpression,
      stmt: Schema[1][number]
    ): void {
      const [firstStatement] = compileChain as [StatementBase | never];

      if (firstStatement instanceof StatementBase) {
        if (stmt instanceof TypeAliasStatement) {
          const outputName = `$_${getCompilePath.call(this)}_${
            stmt.name.value
          }__${this.compileUtils.generateRandomName()}`;

          this.toHoistIdentifierMap.set(stmt.name.value, outputName);

          const nodeFlowToHoist = this.compileUtils
            .createNodeFlow('type ')
            .add(outputName, stmt.name.pos)
            .add(stmt.arguments!.compile())
            .add(' = ')
            .add(stmt.value.compile())
            .add('\n');

          firstStatement.prependCompiledNode(nodeFlowToHoist.get());
        }
      } else {
        throw new Error('SugarBlockExpression: Invalid compile chain');
      }

      function getCompilePath(this: SugarBlockExpression) {
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
    }

    function handleLocalVar(this: SugarBlockExpression, stmt: Schema[1][number]): void {
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
          insideNodeFlow.createSpace(
            (currentSpaceName = this.compileUtils.generateRandomName())
          );

          insideNodeFlow.add(' : ').add('never');
          localVarNames = [];
          localVarProcessing = false;
        }
      }
    }
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

  //  对“当前逻辑”进行包装（如：if块） -> 根据“当前逻辑”的结果（“if块” 的 return 结果）来决定下文的执行流（nextNodeSpaceName 对应的执行空间）
  private executionFlowWrapper(
    nodeFlow: ReturnType<typeof this.compileUtils.createNodeFlow>,
    currentLogicalNodes: CompiledNode[],
    nextExecFlowSpaceName: string
  ) {
    const nameOfCurrLogicalNodes = this.compileUtils.generateRandomName();

    //  (当前逻辑) extends infer 节点结果 ? 节点结果 extends 未返回符号 ？ 下一个逻辑的占用空间 : 节点结果 : never
    nodeFlow
      .add('(')
      .add(currentLogicalNodes)
      .add(`)`)
      .add(' extends ')
      .add(`infer ${nameOfCurrLogicalNodes}`)
      .add(' ? ')
      .add(nameOfCurrLogicalNodes)
      .add(' extends ')
      .add(this.compileUtils.getConstants().UnreturnedSymbol)
      .add(' ? ')
      .createSpace(nextExecFlowSpaceName);

    nodeFlow.add(' : ').add(nameOfCurrLogicalNodes).add(' : ').add('never');
  }
}
