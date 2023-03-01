import * as ast from "../../ast";

export type { TestSource, TestNode };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<any>>;
}

type InsidePrototype<T> = {
  [K in keyof T as K extends "toString" | "compile" ? never : K]?: NonNullable<
    T[K]
  > extends infer NoNullTItem
    ? NoNullTItem extends ast.Base
      ? TestNode<T[K] & any>
      : T[K] extends Function
      ? never
      : NoNullTItem extends any[]
      ? NoNullTItem[number] extends infer NoNullTItemGroup
        ? NoNullTItemGroup extends ast.Base
          ? Array<TestNode<any>>
          : Array<{
              [KK in keyof NoNullTItemGroup]?: NonNullable<
                NoNullTItemGroup[KK]
              > extends ast.Base
                ? TestNode<any>
                : NoNullTItemGroup[KK] extends infer U
                ? U extends ast.Base
                  ? TestNode<any>
                  : U
                : never;
            }>
        : never
      : Partial<T[K]>
    : never;
};

type TestNode<T = any> = {
  instance: T;
  output?: string;
} & (T extends { prototype: infer P }
  ? InsidePrototype<P>
  : InsidePrototype<T>);
