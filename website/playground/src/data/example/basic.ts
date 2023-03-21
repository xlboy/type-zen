import type { Example } from './types';

export const basicExample = {
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
} as const satisfies Example.Index;
