import { expect } from "vitest";
import { Parser } from "../../api/parser";
import * as ast from "../../ast";

export { createSource, createNode, assertSource, mergeString };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<N>>;
}

type TestNode<T> = {
  instance: T & any;
  output?: string;
} & {
  [K in keyof T & string as K extends "toString" | "compile"
    ? never
    : K]?: T[K] extends ast.Base
    ? TestNode<T[K]>
    : T[K] extends Function
    ? never
    : T[K];
};

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

  if ("output" in info) {
    expect(node.compile()).toBe(info.output);
  }

  if ("pos" in info) {
    expect(node.pos).toMatchObject(info.pos!);
  }

  if ("kind" in info) {
    expect(node.kind).toBe(info.kind);
  }

  expect(node.compile()).toBe(info.output);

  for (const key in info) {
    if ((node as any)[key] instanceof ast.Base) {
      assertNode((node as any)[key] as any, (info as any)[key]);
    }
  }
}

function mergeString<T extends string>(...args: T[]): T {
  return args.join("") as T;
}
