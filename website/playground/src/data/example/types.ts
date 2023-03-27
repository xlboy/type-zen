import type { examples } from './index';

export type { Example, ExampleKey };

namespace Example {
  type Common = {
    name: string;
    key: string;
  };
  export type Item = Common & {
    zenCode: string;
    presetTSCode?: string;
  };

  export type Group = Common & {
    children: ReadonlyArray<Example.Index>;
  };

  export type Index = Item | Group;
}

type ExampleKey = GetExampleKey<(typeof examples)[number]>;

/*
@type-zen
@type-zen-playground : https://type-zen-playground.vercel.app/?code=XY%252FLCsIwEEX3%252FYq7rL9gHyBSXLgTXIlCtFMMttMypGAo%252BXfbmpTqKpnJuZcTYzvCgUzxVk1X05Fs6q9n1i3nyHAbIqBqBbHmigQFNGMNbTARgK4QF8gyDHg8dV0K8RbfzN7P0%252BuJVNlybXciyqaKbQ4XKgAzCQV8rh8VwnzhvrmTXBMP%252B0PI9MJ%252F3%252FjpyGfSRUto5foiGzTH3NolFI%252FrJe8il3wA

type GetExampleKey<ExampleUnion> = ^{
  for (infer E in ExampleUnion) {
    if (E == { children: infer Children == ReadonlyArray<any> }) {
      type ChildrenUnion = Children[number];

      return GetExampleKey<ChildrenUnion>
    }
    
    if (E == { key: infer Key }) {
       return Key
    }
  }
};
*/
type GetExampleKey<ExampleUnion> = ExampleUnion extends infer E
  ? (
      E extends {
        children: infer Children extends ReadonlyArray<any>;
      }
        ? [Children[number]] extends [infer ChildrenUnion]
          ? GetExampleKey<ChildrenUnion>
          : never
        : TZ_URS
    ) extends infer r_20r2
    ? r_20r2 extends TZ_URS
      ? E extends {
          key: infer Key;
        }
        ? Key
        : never
      : r_20r2
    : never
  : never;
