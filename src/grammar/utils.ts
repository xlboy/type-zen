import * as ast from "../ast";

export function toASTNode(
  nodeConstructor: ast.Base & {
    new (pos: ast.Type.Position, args: any[]): void;
  }
) {
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
  function cleanseArgs(args: Array<NearleyArg>) {
    return args.filter((arg) => arg !== null) as Array<CleanArg>;
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
    } else {
      pos.start.col = firstArg.col;
      pos.start.line = firstArg.line;
    }

    if (isASTBaseInstance(lastArg)) {
      pos.end = lastArg.pos.end;
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