import * as ast from "../../ast";

export type { TestSource, TestNode };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<any>>;
}

type $_InsidePrototype_KeyFilter<K> = K extends "toString" | "compile"
  ? never
  : K;
type InsidePrototype<T> = {
  [K in keyof T as $_InsidePrototype_KeyFilter<K>]?: [
    NonNullable<T[K]>
  ] extends [infer FilteredValue]
    ? FilteredValue extends ast.Base
      ? TestNode<T[K] & any>
      : FilteredValue extends Function
      ? never
      : FilteredValue extends any[]
      ? FilteredValue[number] extends infer FValueItem
        ? FValueItem extends ast.Base
          ? Array<TestNode<any>>
          : Array<{
              [_K in keyof FValueItem]?: NonNullable<
                FValueItem[_K]
              > extends ast.Base
                ? TestNode<any>
                : FValueItem[_K] extends infer Item
                ? Item extends ast.Base
                  ? TestNode<any>
                  : Item
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
