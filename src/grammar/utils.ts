import * as ast from "../ast";

type NodeConstructor = ast.Base & {
  new (pos: ast.Type.Position, args: any[]): void;
};

export function toASTNode(nodeConstructor: NodeConstructor) {
  // `args` 是 `nearley` 扫描到的 token 集合
  // token 之所以可能为 null，是因为它“本来的内容”是“无意义字符”（↓
  //    如：空格、换行、结尾的分号等——`type_name=1;`，例子中的 `_` 就是空格，而此时这个空格会被过滤成 null；以及结尾处的 `;` 分号符也会被过滤成 null
  //  ↑）
  //
  type NearleyArg = ast.Base | moo.Token | null;
  return (args: Array<NearleyArg>) => {
    const cleanArgs = cleanseArgs(args);

    if (cleanArgs.length === 0) return;

    const pos = getPosRange(cleanArgs);

    try {
      return new nodeConstructor(pos, cleanArgs);
    } catch (error) {
      console.error(error);
    }
  };

  type CleanArg = NonNullable<NearleyArg>;
  /**
   * 净化 args，过滤掉 *null, ...*
   */
  function cleanseArgs(args: Array<NearleyArg>): Array<CleanArg> {
    return args
      .filter((arg) => arg !== null)
      .map((arg) => {
        if (Array.isArray(arg)) return cleanseArgs(arg);
        else return arg;
      }) as any;
  }

  function getPosRange(args: Array<CleanArg>): ast.Type.Position {
    const pos: ast.Type.Position = {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 0 },
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

      const lastLine = lastArg.value.includes("\n")
        ? lastArg.value.slice(lastArg.value.lastIndexOf("\n") + 1)
        : lastArg.value;
      pos.end.col = lastArg.col + lastLine.length;
    }

    return pos;

    function isASTBaseInstance(arg: any): arg is ast.Base {
      return arg instanceof ast.Base;
    }
  }
}

export function filterAndToASTNode(
  args: [data: any[], location: number, reject: Object],
  nodeConstructor: NodeConstructor
) {
  const [, , reject] = args;

  switch (nodeConstructor as any) {
    case ast.ArrayExpression: {
      const [mainNode] = args[0] as [ast.Base];

      if (
        mainNode instanceof ast.Function.Mode.Arrow.Expression ||
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

    case ast.UnionExpression: {
      const [nodes] = args[0] as [ast.Base[]];

      if (nodes[0] instanceof ast.Function.Mode.Arrow.Expression) {
        console.log(
          `[filterAndToASTNode]: UnionExpression -> Function.Mode.Arrow.Expression : reject`
        );
        return reject;
      }

      const hasConditionExpression = nodes.some(
        (node) => node instanceof ast.ConditionExpression
      );
      if (hasConditionExpression) {
        console.log(
          `[filterAndToASTNode]: UnionExpression -> ConditionExpression : reject`
        );
        return reject;
      }

      break;
    }

    case ast.GetKeyValueExpression: {
      const [sourceNode] = args[0] as (ast.Base | null)[];

      if (
        sourceNode instanceof ast.Function.Mode.Arrow.Expression ||
        sourceNode instanceof ast.ConditionExpression ||
        sourceNode instanceof ast.UnionExpression
      ) {
        console.log(
          `[filterAndToASTNode]: GetKeyValueExpression -> Function.Mode.Arrow.Expression | UnionExpression : reject`
        );
        return reject;
      }
      break;
    }

    case ast.ConditionExpression: {
      const [leftNode] = args[0] as (ast.Base | null)[];

      if (leftNode instanceof ast.Function.Mode.Arrow.Expression) {
        console.log(
          `[filterAndToASTNode]: ConditionExpression -> Function.Mode.Arrow.Expression : reject`
        );
        return reject;
      }
      break;
    }
  }

  return toASTNode(nodeConstructor)(args[0]);
}
