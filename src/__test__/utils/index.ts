import { expect } from "vitest";
import { Parser } from "../../api/parser";
import * as ast from "../../ast";
import type { TestNode, TestSource } from "./types";

export {
  createSource,
  createNode,
  assertSource,
  mergeString,
  permuteObjects,
  type TestNode,
};

function createSource<N>(source: TestSource<N>): typeof source {
  return source;
}

function createNode<T>(node: TestNode<T>) {
  return node;
}

function assertSource<T>(source: TestSource<T>) {
  let astNodes!: ast.Base<any>[];
  try {
    astNodes = new Parser(source.content).toAST();
} catch (error) {
    expect({ error, content: source.content }).toMatchSnapshot("parser-error");
    throw error;
}

  expect(astNodes.length).not.toBe(0);

  if (astNodes.length !== 1) {
    expect(source.content).toMatchSnapshot("divergence");
  }

  source.nodes.forEach((sourceNodeInfo, index) => {
    try {
      assertNode(astNodes[index], sourceNodeInfo);
    } catch (error) {
      expect({
        error,
        compile: astNodes[index].compile(),
        info: sourceNodeInfo,
      }).toMatchSnapshot("error");
      throw error;
    }
  });
}

function assertNode(node: ast.Base, info: TestNode<ast.Base>) {
  expect(node).instanceOf(info.instance);

  for (const key in info) {
    const nodeVal = (node as any)[key];
    const infoVal = (info as any)[key];

    if (nodeVal instanceof ast.Base) {
      if (infoVal) {
        assertNode(nodeVal, infoVal);
        continue;
      }
    }

    switch (key) {
      case "output":
        expect(node.compile()).toBe(info.output);
        break;

      case "pos":
        expect(node.pos).toMatchObject(info.pos!);
        break;

      case "kind":
        expect(node.kind).toBe(info.kind);
        break;

      default: {
        const recursiveHandle = (nodeVal: any, infoVal: any) => {
          if (!nodeVal || !infoVal) return;
          if (typeof nodeVal === "function") return;

          if (Array.isArray(nodeVal) && Array.isArray(infoVal)) {
            infoVal.forEach((info, index) => {
              const node = nodeVal[index] as
                | ast.Base
                | Record<string, unknown>
                | undefined;
              if (node instanceof ast.Base) {
                assertNode(node, info);
              } else {
                if (
                  Object.prototype.toString.call(node) === "[object Object]"
                ) {
                  for (const nKey in node) {
                    if (node[nKey] instanceof ast.Base && info[nKey]) {
                      assertNode((node as any)[nKey], info[nKey]);
                    } else {
                      expect(node[nKey]).toBe(info[nKey]);
                    }
                  }
                }
              }
            });
          } else if (nodeVal instanceof ast.Base) {
            assertNode(nodeVal, infoVal);
          } else if (
            typeof nodeVal === "object" &&
            typeof infoVal === "object"
          ) {
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
  return args.join("") as T;
}

/**
 * 对象数组的全排列，可以指定最小长度和最大长度
 */
function permuteObjects<T>(
  objs: T[],
  minLength = 1,
  maxLength = objs.length
): T[][] {
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
