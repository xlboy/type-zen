import type { O } from 'ts-toolbelt';
import type { ReadonlyDeep } from 'type-fest';

import type { ASTBase, ASTNodePosition } from '../ast';
import { compiler } from './compiler';
import type { CompiledNode, CompilerConfig } from './types';

export { ASTCompileBase };

const compileStack: ASTCompileBase[] = [];

abstract class ASTCompileBase {
  constructor() {
    this.compile = this.rewriteCompile();
  }

  /**
   * @returns 返回编译后的代码
   */
  public abstract compile(...args: any[]): any;

  private rewriteCompile() {
    const oldCompileFn = this.compile.bind(this);
    const fn = () => {
      compileStack.push(this);
      const compileResult = oldCompileFn();

      compileStack.pop();

      return compileResult;
    };

    return fn as typeof this.compile;
  }

  protected get compileUtils() {
    return {
      getConfig: (): ReadonlyDeep<O.Required<CompilerConfig, string, 'deep'>> => {
        return compiler.config as any;
      },
      getChain: (): ReadonlyDeep<ASTBase>[] => {
        return compileStack as any;
      },
      createNodeFlow: createCompiledNodeFlow,
      getConstants: () =>
        ({
          UnreturnedSymbol: 'UnreturnedSymbol'
        } as const)
    };

    function createCompiledNodeFlow(
      ..._args:
        | [text: string, sourcePos?: ASTNodePosition]
        | [compiledNodes: CompiledNode[]]
        | []
    ) {
      type Space = ReturnType<typeof createCompiledNodeFlow>;
      type SpaceName = string;
      type NodeIndex = number;
      const nodes: Array<CompiledNode | Space> = [];
      const spaceIndexMap = new Map<SpaceName, NodeIndex>();

      const obj = {
        createSpace(spaceName: string) {
          nodes.push(createCompiledNodeFlow());
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
            | [text: string, sourcePos?: ASTNodePosition]
            | [compiledNodes: CompiledNode[]]
        ) {
          if (Array.isArray(args[0])) {
            const [compiledNodes] = args;

            nodes.push(...compiledNodes);
          } else {
            const [text, sourcePos] = args;
            const node: CompiledNode = { text, pos: {} };

            if (sourcePos) node.pos!.source = sourcePos;

            nodes.push(node);
          }

          return this;
        },
        get(): CompiledNode[] {
          return nodes
            .map(n => {
              const isSpace = 'createSpace' in n;

              return isSpace ? n.get() : n;
            })
            .flat(Infinity) as any;
        }
      };

      if (_args.length !== 0) {
        obj.add(..._args);
      }

      return obj;
    }
  }
}
