import type * as moo from 'moo';

import type { ASTNodePosition } from '../ast';
import * as ast from '../ast';
import { NearleyError, Parser } from '../parser';

export { toASTNode, filterAndToASTNode, filterTemplateStringContent };

type NodeConstructor = new (pos: ASTNodePosition, args: any[]) => ast.ASTBase;

function toASTNode(nodeConstructor: NodeConstructor) {
  // `args` 是 `nearley` 扫描到的 token 集合
  // token 之所以可能为 null，是因为它“本来的内容”是“无意义字符”（↓
  //    如：空格、换行、结尾的分号等——`type_name=1;`，例子中的 `_` 就是空格，而此时这个空格会被过滤成 null；以及结尾处的 `;` 分号符也会被过滤成 null
  //  ↑）
  //
  type NearleyArg = ast.ASTBase | moo.Token | null;

  return (args: Array<NearleyArg>) => {
    const cleanArgs = removeNull(args);

    if (cleanArgs.length === 0) return;

    const pos = getPosRange(cleanArgs);

    try {
      return new nodeConstructor(pos, cleanArgs);
    } catch (error) {
      console.error(error);
    }
  };

  type CleanArg = NonNullable<NearleyArg>;

  function removeNull(args: Array<NearleyArg>): Array<CleanArg> {
    return args
      .filter(arg => arg !== null)
      .map(arg => {
        if (Array.isArray(arg)) return removeNull(arg);
        else return arg;
      }) as any;
  }

  function getPosRange(args: Array<CleanArg>): ASTNodePosition {
    const pos: ASTNodePosition = {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 0 }
    };

    const firstArg = args[0];
    const lastArg = args[args.length - 1];

    if (isASTBaseInstance(firstArg)) {
      pos.start = firstArg.pos.start;
    } else if (Array.isArray(firstArg)) {
      pos.start = getPosRange(firstArg).start;
    } else {
      pos.start.col = firstArg.col;
      pos.start.line = firstArg.line;
    }

    if (isASTBaseInstance(lastArg)) {
      pos.end = lastArg.pos.end;
    } else if (Array.isArray(lastArg)) {
      pos.end = getPosRange(lastArg).end;
    } else {
      pos.end.line = lastArg.line + lastArg.lineBreaks;

      const lastLine = lastArg.value.includes('\n')
        ? lastArg.value.slice(lastArg.value.lastIndexOf('\n') + 1)
        : lastArg.value;

      pos.end.col = lastArg.col + lastLine.length;
    }

    return pos;

    function isASTBaseInstance(arg: any): arg is ast.ASTBase {
      return arg instanceof ast.ASTBase;
    }
  }
}

function filterAndToASTNode(
  args: [data: any[], location: number, reject: Object],
  nodeConstructor: NodeConstructor
) {
  const [, , reject] = args;

  switch (nodeConstructor as any) {
    case ast.ArrayExpression: {
      const [mainNode] = args[0] as [ast.ASTBase];

      if (
        mainNode instanceof ast.Function.Mode.ArrowExpression ||
        mainNode instanceof ast.Function.Mode.ConstructorExpression ||
        mainNode instanceof ast.ConditionExpression
      ) {
        console.log(
          `[filterAndToASTNode]: ArrayExpression -> ${mainNode.toString()} : reject`
        );

        return reject;
      }

      if (mainNode instanceof ast.UnionExpression) {
        if (!mainNode.isExtended) {
          console.log(
            `[filterAndToASTNode]: ArrayExpression -> UnionExpression : reject`
          );

          return reject;
        }
      }

      break;
    }

    case ast.KeyofExpression: {
      const [, sourceNode] = args[0] as [any, ast.ASTBase];

      if (
        sourceNode instanceof ast.IntersectionExpression ||
        sourceNode instanceof ast.UnionExpression
      ) {
        if (!sourceNode.isExtended) {
          console.log(
            `[filterAndToASTNode]: KeyofExpression -> ${sourceNode.kind} : reject`
          );

          return reject;
        }
      }

      break;
    }

    case ast.IntersectionExpression:
    case ast.UnionExpression: {
      const [nodes] = args[0] as [ast.ASTBase[]];

      if (
        nodes[0] instanceof ast.Function.Mode.ArrowExpression ||
        nodes[0] instanceof ast.Function.Mode.ConstructorExpression ||
        nodes[0] instanceof ast.InferExpression
      ) {
        console.log(
          `[filterAndToASTNode]: ${nodeConstructor.name} -> ${nodes[0].kind} : reject`
        );

        return reject;
      }

      const hasConditionExpression = nodes.some(
        node => node instanceof ast.ConditionExpression
      );

      if (hasConditionExpression) {
        console.log(
          `[filterAndToASTNode]: ${nodeConstructor.name} -> ConditionExpression : reject`
        );

        return reject;
      }

      break;
    }

    case ast.ElementAccessExpression: {
      const [sourceNode] = args[0] as (ast.ASTBase | null)[];

      if (
        sourceNode instanceof ast.Function.Mode.ArrowExpression ||
        sourceNode instanceof ast.Function.Mode.ConstructorExpression ||
        sourceNode instanceof ast.ConditionExpression ||
        sourceNode instanceof ast.UnionExpression ||
        sourceNode instanceof ast.InferExpression ||
        sourceNode instanceof ast.KeyofExpression
      ) {
        console.log(
          `[filterAndToASTNode]: ElementAccessExpression -> ${sourceNode.kind} : reject`
        );

        return reject;
      }

      break;
    }

    case ast.ConditionExpression: {
      const [leftNode] = args[0] as (ast.ASTBase | null)[];

      if (
        leftNode instanceof ast.Function.Mode.ArrowExpression ||
        leftNode instanceof ast.Function.Mode.ConstructorExpression
      ) {
        console.log(`[filterAndToASTNode]: ConditionExpression -> Function : reject`);

        return reject;
      }

      break;
    }
  }

  return toASTNode(nodeConstructor)(args[0]);
}

type TemplateStringTokenType =
  | 'tplString'
  | 'tplInterpStart'
  | 'tplInterpContent'
  | 'tplInterpString'
  | 'tplInterpEnd';
function filterTemplateStringContent(
  content: Array<moo.Token & { type: TemplateStringTokenType }>
) {
  const result: Array<string | ast.ExpressionBase> = [];
  let currentStr = '';

  for (let i = 0; i < content.length; i++) {
    const token = content[i];

    switch (token.type) {
      case 'tplString': {
        currentStr += token.value;

        break;
      }

      case 'tplInterpStart': {
        if (currentStr) {
          result.push(currentStr);
          currentStr = '';
        }

        const interpEndTokenIndex = content
          .slice(i)
          .findIndex(token => token.type === 'tplInterpEnd');

        if (interpEndTokenIndex === -1) throwNoInterpEndError();

        const interpContentArr = content.slice(i + 1, i + interpEndTokenIndex);
        const interpExprStr = interpContentArr
          .map(token => token.value)
          .join('')
          .trimEnd();

        let parsedExpr: ast.ExpressionBase | null = null;

        try {
          parsedExpr = new Parser({ source: 'expression' }).parse(interpExprStr);
        } catch (error) {
          throwInterpParseError(error as any);
        }

        if (!parsedExpr) throwInvalidInterpError();

        result.push(parsedExpr!);
        i = i + interpEndTokenIndex;

        break;

        function throwInvalidInterpError() {
          const errorMessage = `The interpolation is invalid, \`${interpExprStr}\` is not a valid expression`;
          const errorOrigin = new Error(errorMessage) as NearleyError.ErrorOrigin;

          errorOrigin.token = token;
          errorOrigin.message = errorMessage;

          throw new NearleyError.UnexpectedInput(
            token.line,
            token.col,
            token.offset,
            errorOrigin
          );
        }

        function throwInterpParseError(error: NearleyError.UnexpectedInput) {
          const errorMessage = 'The interpolation is invalid';
          const errorOrigin = new Error(errorMessage) as NearleyError.ErrorOrigin;

          error.line = token.line + error.line - 1;
          if (error.line === 1) {
            error.col = token.col + error.col - 1;
          }

          error.offset = token.offset + error.offset - 1;
          errorOrigin.token = token;
          errorOrigin.message = errorMessage;

          throw new NearleyError.UnexpectedInput(
            token.line,
            token.col,
            token.offset,
            errorOrigin
          );
        }

        function throwNoInterpEndError() {
          const errorOrigin = new Error(
            'The interpolation is invalid and lacks a corresponding `}`'
          ) as NearleyError.ErrorOrigin;

          errorOrigin.token = token;
          errorOrigin.message = `The interpolation is invalid and lacks a corresponding \`}\``;

          throw new NearleyError.UnexpectedInput(
            token.line,
            token.col,
            token.offset,
            errorOrigin
          );
        }
      }
    }

    if (i === content.length - 1 && currentStr) {
      result.push(currentStr);
    }
  }

  return result;
}

function filterAtFinish() {}
