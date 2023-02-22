import { expect } from "vitest";
import { Parser } from "../../api/parser";
import * as ast from "../../ast";

export { createSource, createNode, assertSource, mergeString };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<any>>;
}

type InsidePrototype<T> = {
  [K in keyof T as K extends "toString" | "compile" ? never : K]?: NonNullable<
    T[K]
  > extends ast.Base
    ? TestNode<T[K] & any>
    : T[K] extends Function
    ? never
    : NonNullable<T[K]> extends any[]
    ? NonNullable<T[K]>[number] extends ast.Base
      ? Array<TestNode<any>>
      : Array<{
          [KK in keyof NonNullable<T[K]>[number]]?: NonNullable<
            NonNullable<T[K]>[number][KK]
          > extends ast.Base
            ? TestNode<any>
            : NonNullable<T[K]>[number][KK];
        }>
    : T[K];
};

type TestNode<T> = {
  instance: T;
  output?: string;
} & (T extends { prototype: infer P }
  ? InsidePrototype<P>
  : InsidePrototype<T>);

function createSource<N>(source: TestSource<N>): typeof source {
  return source;
}

function createNode<T>(node: TestNode<T>) {
  return node;
}

function assertSource<T>(source: TestSource<T>) {
  const astNodes = new Parser(source.content).toAST();

  expect(astNodes.length).not.toBe(0);

  source.nodes.forEach((sourceNodeInfo, index) => {
    assertNode(astNodes[index], sourceNodeInfo);
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
        if (!nodeVal || !infoVal) break;
        if (typeof nodeVal === "function") break;
        if (Array.isArray(nodeVal) && Array.isArray(infoVal)) {
          infoVal.forEach((info, index) => {
            const node = nodeVal[index] as
              | ast.Base
              | Record<string, unknown>
              | undefined;
            if (node instanceof ast.Base) {
              assertNode(node, info);
            } else {
              if (Object.prototype.toString.call(node) === "[object Object]") {
                for (const nKey in node) {
                  if (
                    node[nKey] instanceof ast.Base &&
                    info[nKey] instanceof ast.Base
                  ) {
                    assertNode((node as any)[nKey], info[nKey]);
                  }
                }
              }
            }
          });
        } else if (typeof nodeVal === "object" && typeof infoVal === "object") {
          expect(nodeVal).toMatchObject(infoVal);
        } else {
          expect(nodeVal).toBe(infoVal);
        }
        break;
      }
    }
  }
}

function mergeString<T extends string>(...args: T[]): T {
  return args.join("") as T;
}
