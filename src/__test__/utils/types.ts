import * as ast from "../../ast";

export type { TestSource, TestNode };

interface TestSource<N> {
  content: string;
  nodes: Array<TestNode<any>>;
}

// type InsidePrototype<T> = {
//   [K in keyof T as K extends "toString" | "compile" ? never : K]?: NonNullable<
//     T[K]
//   > extends ast.Base
//     ? TestNode<T[K] & any>
//     : T[K] extends Function
//     ? never
//     : NonNullable<T[K]> extends any[]
//     ? NonNullable<T[K]>[number] extends ast.Base
//       ? Array<TestNode<any>>
//       : Array<{
//           [KK in keyof NonNullable<T[K]>[number]]?: NonNullable<
//             NonNullable<T[K]>[number][KK]
//           > extends ast.Base
//             ? TestNode<any>
//             : NonNullable<T[K]>[number][KK] extends infer U
//             ? U extends ast.Base
//               ? TestNode<any>
//               : U
//             : never;
//         }>
//     : Partial<T[K]>;
// };

type InsidePrototype<T> = {
  [K in keyof T as K extends "toString" | "compile" ? never : K]?: NonNullable<
    T[K]
  > extends infer NoNull_TItem
    ? NoNull_TItem extends ast.Base
      ? TestNode<T[K] & any>
      : T[K] extends Function
      ? never
      : NoNull_TItem extends any[]
      ? NoNull_TItem[number] extends infer NoNull_TItemGroup
        ? NoNull_TItemGroup extends ast.Base
          ? Array<TestNode<any>>
          : Array<{
              [KK in keyof NoNull_TItemGroup]?: NonNullable<
                NoNull_TItemGroup[KK]
              > extends ast.Base
                ? TestNode<any>
                : NoNull_TItemGroup[KK] extends infer U
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
