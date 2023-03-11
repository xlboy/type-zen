export namespace ExampleSource {
  type Common = {
    name: string;
    key: string;
  };
  export type Item = Common & { zenCode: string };

  export type Group = Common & { children: ReadonlyArray<ExampleSource.Index> };

  export type Index = Item | Group;
}

export type ExampleKey = ExampleSource.Index['key'];

export const exampleSource = [
  {
    key: 'basic',
    name: 'Basic',
    zenCode: `
type Union1 = | [1, 3, 5]
type Union2 = 1 | 3 | 5

type Intersection1 = & [1, 3, 5]
type Intersection2 = 1 & 3 & 5

type MyOmit<T: object, K: keyof T, AllKey: keyof T = keyof T> = {
  [key in AllKey extends K ? never : AllKey]: T[key];
};

type IsNumber<V> = V == number ? true : false
`
  },
  {
    key: 'sugar',
    name: 'Sugar',
    children: [
      {
        key: 'sugar-local-variable',
        name: 'Local Variable',
        zenCode: `
type Example1 = ^{
  type A = 1;
  type B = 2;
    
  return [A, '-------', B]
}
`
      }
    ]
  }
] as const satisfies ReadonlyArray<ExampleSource.Index>;

export function findExampleByKey(
  key: string,
  children: ReadonlyArray<ExampleSource.Index> = exampleSource
): ExampleSource.Item | undefined {
  for (const item of children) {
    if ('children' in item) {
      const result = findExampleByKey(key, item.children);

      if (result) {
        return result;
      }
    } else {
      if (item.key === key) {
        return item;
      }
    }
  }
}
