import { expect } from 'vitest';

import type { ExpressionBase, StatementBase } from '../../ast';
import { ASTBase } from '../../ast';
import type { CompiledNode } from '../../compiler';
import { Parser } from '../../parser';
import type { TestNode, TestSource } from './types';

export {
  assertSource,
  createNode,
  createSource,
  mergeString,
  permuteObjects,
  type TestNode
};

function createSource<N>(source: TestSource<N>): typeof source {
  return source;
}

function createNode<T>(node: TestNode<T>) {
  return node;
}

function assertSource<T>(source: TestSource<T>) {
  let statements!: StatementBase[];

  try {
    statements = new Parser().parse(source.content) || [];
  } catch (error) {
    expect({ error, content: source.content }).toMatchSnapshot('parser-error');
    throw error;
  }

  expect(statements.length).not.toBe(0);

  if (statements.length !== 1) {
    expect(source.content).toMatchSnapshot('divergence');
  }

  source.nodes.forEach((sourceNodeInfo, index) => {
    try {
      assertNode(statements[index], sourceNodeInfo);
    } catch (error) {
      expect({
        error,
        compileNodes: statements[index].compile(),
        compiledText: (statements[index].compile().flat(Infinity) as CompiledNode[])
          .map(cNode => cNode.text)
          .join(''),
        info: sourceNodeInfo
      }).toMatchSnapshot('error');
      throw error;
    }
  });
}

function assertNode(node: StatementBase | ExpressionBase, info: TestNode<ASTBase>) {
  expect(node).instanceOf(info.instance);

  for (const key in info) {
    const nodeVal = (node as any)[key];
    const infoVal = (info as any)[key];

    if (nodeVal instanceof ASTBase) {
      if (infoVal) {
        assertNode(nodeVal, infoVal);
        continue;
      }
    }

    switch (key) {
      case 'outputReg':
      case 'outputStr': {
        const output = (
          node.compile().flat(Infinity) as CompiledNode[]
        ) /* 可能是“顶级语句”（二维），也可能是“普通语句”（一维）  */
          .map(cNode => cNode.text)
          .join('');

        if (key === 'outputReg') {
          expect(output).toMatch(info.outputReg!);
        } else {
          expect(output).toBe(info.outputStr);
        }

        break;
      }

      case 'pos':
        expect(node.pos).toMatchObject(info.pos!);
        break;

      case 'kind':
        expect(node.kind).toBe(info.kind);
        break;

      default: {
        const recursiveHandle = (nodeVal: any, infoVal: any) => {
          if (!nodeVal || !infoVal) return;
          if (typeof nodeVal === 'function') return;

          if (Array.isArray(nodeVal) && Array.isArray(infoVal)) {
            infoVal.forEach((info, index) => {
              const node = nodeVal[index] as
                | ASTBase
                | Record<string, unknown>
                | undefined;

              if (node instanceof ASTBase) {
                assertNode(node, info);
              } else {
                if (Object.prototype.toString.call(node) === '[object Object]') {
                  for (const nKey in node) {
                    if (node[nKey] instanceof ASTBase && info[nKey]) {
                      assertNode((node as any)[nKey], info[nKey]);
                    } else {
                      expect(node[nKey]).toBe(info[nKey]);
                    }
                  }
                }
              }
            });
          } else if (nodeVal instanceof ASTBase) {
            assertNode(nodeVal, infoVal);
          } else if (typeof nodeVal === 'object' && typeof infoVal === 'object') {
            for (const iKey in infoVal) {
              recursiveHandle(nodeVal[iKey], infoVal[iKey]);
            }
          } else {
            expect(nodeVal).toBe(infoVal);
          }
        };

        recursiveHandle(nodeVal, infoVal);
      }
    }
  }
}

function mergeString<T extends string>(...args: T[]): T {
  return args.join('') as T;
}

/**
 * 对象数组的全排列，可以指定最小长度和最大长度
 */
function permuteObjects<T>(objs: T[], minLength = 1, maxLength = objs.length): T[][] {
  if (minLength > objs.length) {
    return [];
  }

  if (!maxLength) {
    maxLength = objs.length;
  }

  const result: T[][] = [];

  function permute(arr: T[], memo: T[] = []) {
    if (memo.length >= minLength && memo.length <= (maxLength || 0)) {
      result.push(memo);
    }

    if (memo.length === maxLength) {
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      const curr = arr.slice();
      const next = curr.splice(i, 1);

      permute(curr.slice(), memo.concat(next));
    }
  }

  permute(objs);

  return result;
}
