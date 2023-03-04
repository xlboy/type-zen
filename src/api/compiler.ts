import { ASTBase } from "../ast/base";
import { TopLevelStatementBase } from "../ast/statements/top-level/base";
import { AST } from "../ast/types";

export { Compiler };

let _config: Readonly<Compiler.Config>;

class Compiler {
  private topNodePos = new WeakMap<ASTBase, Record<"col" | "line", number>>();

  constructor(config: Compiler.Config = {}) {
    config.indent ??= 2;
    config.memberSeparator ??= ";";
    config.useLineTerminator ??= true;
    _config = config;
  }

  public compile(nodes: TopLevelStatementBase[]) {
    let currentLine = 1;
    let currentCol = 1;
    for (const node of nodes) {
      this.topNodePos.set(node, { line: currentLine, col: currentCol });

      const compiledNode = node.compile();

      console.log(compiledNode);

      const str = compiledNode.reduce((prev, curr) => {
        let str = "";
        curr.forEach((node) => {
          str += node.text;
        });

        return prev + str;
      }, "");

      console.log(str);
    }
  }
}
namespace Compiler {
  export interface Node {
    text: string;
    pos?: {
      result?: AST.Position;
      source?: AST.Position;
    };
  }
  export interface Config {
    /**
     * 是否在每行末尾添加分号
     * @default true
     */
    useLineTerminator?: boolean;

    /**
     * 成员分隔符
     * @default ";"
     */
    memberSeparator?: "," | ";" | false;
    /**
     * 缩进字符数
     * @default 2
     */
    indent?: number;
  }

  export namespace Utils {
    export function getConfig() {
      return _config;
    }

    export function createNodeFlow(
      ..._args:
        | [text: string, sourcePos?: AST.Position]
        | [compiledNodes: Node[]]
        | []
    ) {
      type Space = ReturnType<typeof createNodeFlow>;
      const nodes: Array<Node | Space> = [];
      const spaceIndexMap = new Map<
        /* space-name */ string,
        /* node-index */ number
      >();

      const obj = {
        createSpace(spaceName: string) {
          nodes.push(createNodeFlow());
          spaceIndexMap.set(spaceName, nodes.length - 1);
          return this;
        },
        getSpace(spaceName: string) {
          const spaceIndex = spaceIndexMap.get(spaceName);
          if (spaceIndex === undefined) {
            throw new Error(`[compiler createNode] 未找到空间 ${spaceName}`);
          }

          return nodes[spaceIndex] as Space;
        },

        add(
          ...args:
            | [text: string, sourcePos?: AST.Position]
            | [compiledNodes: Node[]]
        ) {
          if (Array.isArray(args[0])) {
            const [compiledNodes] = args;
            nodes.push(...compiledNodes);
          } else {
            const [text, sourcePos] = args;
            const node: Compiler.Node = { text, pos: {} };

            if (sourcePos) node.pos!.source = sourcePos;

            nodes.push(node);
          }

          return this;
        },
        get(): Node[] {
          return nodes
            .map((n) => {
              const isSpace = "createSpace" in n;
              if (isSpace) {
                return n.get();
              }

              return n;
            })
            .flat(Infinity) as any;
        },
      };

      if (_args.length !== 0) {
        obj.add(..._args);
      }

      return obj;
    }
  }

  export namespace Constants {
    export const UnreturnedSymbol = "UnreturnedSymbol" as const;
  }
}
