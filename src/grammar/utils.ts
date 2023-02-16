import { ASTBase, AST } from "../ast";

export function toASTNode(
  nodeConstructor: ASTBase & {
    new (pos: AST.Position, args: any[]): void;
  }
) {
  // `args` 是 `nearley` 扫描到的 token 集合
  // token 之所以可能为 null，是因为它“本来的内容”是“无意义字符”（↓
  //    如：空格、换行、结尾的分号等——`type_name=1;`，例子中的 `_` 就是空格，而此时这个空格会被过滤成 null；以及结尾处的 `;` 分号符也会被过滤成 null
  //  ↑）
  // 这些
  type NearleyArg = ASTBase | moo.Token | null;
  return (args: Array<NearleyArg>) => {
    const cleanArgs = cleanseArgs(args);

    if (cleanArgs.length === 0) return;

    try {
      const pos = getPosRange(cleanArgs);
      return new nodeConstructor(pos, args);
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

  function getPosRange(args: Array<CleanArg>): AST.Position {
    const pos: AST.Position = {
      start: { line: 0, col: 0 },
      end: { line: 0, col: 0 },
    };
    const firstArg = args[0];
    const lastArg = args[args.length - 1];

    if (isContainsASTBaseClass(firstArg)) {
      pos.start = firstArg.pos.start;
    } else {
      pos.start.col = firstArg.col;
      pos.start.line = firstArg.line;
    }

    if (isContainsASTBaseClass(lastArg)) {
      pos.end = lastArg.pos.end;
    } else {
      pos.end.line = lastArg.line + lastArg.lineBreaks;
      const lastLine = lastArg.text.includes("\n")
        ? lastArg.text.slice(lastArg.text.lastIndexOf("\n") + 1)
        : lastArg.text;
      pos.end.col = lastArg.col + lastLine.length;
    }

    return pos;

    function isContainsASTBaseClass(arg: any): arg is ASTBase {
      return arg instanceof ASTBase;
    }
  }
}
