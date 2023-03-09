import type { ASTBase } from '../../ast';

export type { TestSource, TestNode };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<any>>;
}

type $_InsidePrototype_SugarBlock__KeyFilter__r_pebh<K> = K extends 'toString' | 'compile'
  ? never
  : K;
type InsidePrototype<T> = {
  [K in keyof T as $_InsidePrototype_SugarBlock__KeyFilter__r_pebh<K>]?: [
    NonNullable<T[K]>
  ] extends [infer FilteredValue]
    ? (
        FilteredValue extends ASTBase ? TestNode<T[K] & any> : UnreturnedSymbol
      ) extends infer r_sxtu
      ? r_sxtu extends UnreturnedSymbol
        ? (FilteredValue extends Function ? never : UnreturnedSymbol) extends infer r_3ln7
          ? r_3ln7 extends UnreturnedSymbol
            ? FilteredValue extends any[]
              ? FilteredValue[number] extends infer FValueItem
                ? (
                    FValueItem extends ASTBase ? Array<TestNode<any>> : UnreturnedSymbol
                  ) extends infer r_702l
                  ? r_702l extends UnreturnedSymbol
                    ? Array<{
                        [_K in keyof FValueItem]?: (
                          NonNullable<FValueItem[_K]> extends ASTBase
                            ? TestNode<any>
                            : UnreturnedSymbol
                        ) extends infer r_51ma
                          ? r_51ma extends UnreturnedSymbol
                            ? FValueItem[_K] extends infer Item
                              ? Item extends ASTBase
                                ? TestNode<any>
                                : Item
                              : never
                            : r_51ma
                          : never;
                      }>
                    : r_702l
                  : never
                : never
              : Partial<T[K]>
            : r_3ln7
          : never
        : r_sxtu
      : never
    : never;
};

type TestNode<T = any> = {
  instance: T;
  outputStr?: string;
  outputReg?: RegExp;
} & (T extends { prototype: infer P } ? InsidePrototype<P> : InsidePrototype<T>);
