import type { ASTNodePosition } from '../ast';
import * as AST from '../ast';

type NodeConstructor = AST.ASTBase & {
  new (pos: ASTNodePosition, args: any[]): void;
};

export function toASTNode(nodeConstructor: NodeConstructor) {
  // `args` 是 `nearley` 扫描到的 token 集合
  // token 之所以可能为 null，是因为它“本来的内容”是“无意义字符”（↓
  //    如：空格、换行、结尾的分号等——`type_name=1;`，例子中的 `_` 就是空格，而此时这个空格会被过滤成 null；以及结尾处的 `;` 分号符也会被过滤成 null
  //  ↑）
  //
  type NearleyArg = AST.ASTBase | moo.Token | null;

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

    function isASTBaseInstance(arg: any): arg is AST.ASTBase {
      return arg instanceof AST.ASTBase;
    }
  }
}

export function filterAndToASTNode(
  args: [data: any[], location: number, reject: Object],
  nodeConstructor: NodeConstructor
) {
  const [, , reject] = args;

  switch (nodeConstructor as any) {
    case AST.ArrayExpression: {
      const [mainNode] = args[0] as [AST.ASTBase];

      if (
        mainNode instanceof AST.Function.Mode.ArrowExpression ||
        mainNode instanceof AST.Function.Mode.ConstructorExpression ||
        mainNode instanceof AST.ConditionExpression
      ) {
        console.log(
          `[filterAndToASTNode]: ArrayExpression -> ${mainNode.toString()} : reject`
        );

        return reject;
      }

      if (mainNode instanceof AST.UnionExpression) {
        if (!mainNode.isExtended) {
          console.log(
            `[filterAndToASTNode]: ArrayExpression -> UnionExpression : reject`
          );

          return reject;
        }
      }

      break;
    }

    case AST.KeyofExpression: {
      const [, sourceNode] = args[0] as [any, AST.ASTBase];

      if (
        sourceNode instanceof AST.IntersectionExpression ||
        sourceNode instanceof AST.UnionExpression
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

    case AST.IntersectionExpression:
    case AST.UnionExpression: {
      const [nodes] = args[0] as [AST.ASTBase[]];

      if (
        nodes[0] instanceof AST.Function.Mode.ArrowExpression ||
        nodes[0] instanceof AST.Function.Mode.ConstructorExpression ||
        nodes[0] instanceof AST.InferExpression
      ) {
        console.log(
          `[filterAndToASTNode]: ${nodeConstructor.name} -> ${nodes[0].kind} : reject`
        );

        return reject;
      }

      const hasConditionExpression = nodes.some(
        node => node instanceof AST.ConditionExpression
      );

      if (hasConditionExpression) {
        console.log(
          `[filterAndToASTNode]: ${nodeConstructor.name} -> ConditionExpression : reject`
        );

        return reject;
      }

      break;
    }

    case AST.GetKeyValueExpression: {
      const [sourceNode] = args[0] as (AST.ASTBase | null)[];

      if (
        sourceNode instanceof AST.Function.Mode.ArrowExpression ||
        sourceNode instanceof AST.Function.Mode.ConstructorExpression ||
        sourceNode instanceof AST.ConditionExpression ||
        sourceNode instanceof AST.UnionExpression ||
        sourceNode instanceof AST.InferExpression ||
        sourceNode instanceof AST.KeyofExpression
      ) {
        console.log(
          `[filterAndToASTNode]: GetKeyValueExpression -> ${sourceNode.kind} : reject`
        );

        return reject;
      }

      break;
    }

    case AST.ConditionExpression: {
      const [leftNode] = args[0] as (AST.ASTBase | null)[];

      if (
        leftNode instanceof AST.Function.Mode.ArrowExpression ||
        leftNode instanceof AST.Function.Mode.ConstructorExpression
      ) {
        console.log(`[filterAndToASTNode]: ConditionExpression -> Function : reject`);

        return reject;
      }

      break;
    }
  }

  return toASTNode(nodeConstructor)(args[0]);
}
