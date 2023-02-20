import { expect } from "vitest";
import { Parser } from "../../api/parser";
import * as ast from "../../ast";

export { createSource, createNode, assertSource, mergeString };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<any>>;
}

type InsidePrototype<T> = {
  [K in keyof T as K extends "toString" | "compile"
    ? never
    : K]?: T[K] extends ast.Base
    ? TestNode<T[K] & any>
    : T[K] extends Function
    ? never
    : NonNullable<T[K]> extends ast.Base[]
    ? Array<TestNode<any>>
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
            const node = nodeVal[index] as ast.Base | undefined;
            if (node) {
              assertNode(node, info);
            }
          });
        }
        break;
      }
    }
  }
}

function mergeString<T extends string>(...args: T[]): T {
  return args.join("") as T;
}
