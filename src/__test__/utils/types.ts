import * as ast from "../../ast";

export type { TestSource, TestNode };

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
    : Partial<T[K]>;
};

type TestNode<T = any> = {
  instance: T;
  output?: string;
} & (T extends { prototype: infer P }
  ? InsidePrototype<P>
  : InsidePrototype<T>);
