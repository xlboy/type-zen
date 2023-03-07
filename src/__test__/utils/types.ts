import type { ASTBase } from '../../ast';

export type { TestSource, TestNode };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<any>>;
}

type KeyFilter<K> = K extends 'toString' | 'compile' ? never : K;
type InsidePrototype<T> = {
  [K in keyof T as KeyFilter<K>]?: [NonNullable<T[K]>] extends [infer FilteredValue]
    ? FilteredValue extends ASTBase
      ? TestNode<T[K] & any>
      : FilteredValue extends Function
      ? never
      : FilteredValue extends any[]
      ? FilteredValue[number] extends infer FValueItem
        ? (
            FValueItem extends ASTBase ? Array<TestNode<any>> : UnreturnedSymbol
          ) extends infer r_xnpm
          ? r_xnpm extends UnreturnedSymbol
            ? Array<{
                [_K in keyof FValueItem]?: (
                  NonNullable<FValueItem[_K]> extends ASTBase
                    ? TestNode<any>
                    : UnreturnedSymbol
                ) extends infer r_rxng
                  ? r_rxng extends UnreturnedSymbol
                    ? FValueItem[_K] extends infer Item
                      ? Item extends ASTBase
                        ? TestNode<any>
                        : Item
                      : never
                    : r_rxng
                  : never;
              }>
            : r_xnpm
          : never
        : never
      : Partial<T[K]>
    : never;
};

type TestNode<T = any> = {
  instance: T;
  output?: string;
} & (T extends { prototype: infer P } ? InsidePrototype<P> : InsidePrototype<T>);
