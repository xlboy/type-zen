import type { Example } from '../types';

export const tcEasyExample = {
  key: 'type-challenges-easy',
  name: 'Easy',
  children: [
    {
      key: 'type-challenges-easy-1_pick',
      name: '1 - Pick',
      zenCode: `
type MyPick<T, K: keyof T> = {
  [key in K]: T[key]
}
`
    },
    {
      key: 'type-challenges-easy-2_readonly',
      name: '2 - Readonly',
      zenCode: `
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key]
} 
`
    },
    {
      key: 'type-challenges-easy-3_tuple-to-object',
      name: '3 - Tuple to Object',
      zenCode: `
type TupleToObject<T: ReadonlyArray<any>> = { 
  [K in T[number]]: K 
};
`
    },
    {
      key: 'type-challenges-easy-4_first-of-array',
      name: '4 - First of Array',
      zenCode: `type First<T: any[]> = T == [] ? never : T[0]`
    },
    {
      key: 'type-challenges-easy-5_length-of-tuple',
      name: '5 - Length of Tuple',
      zenCode: `
type Length<T: ReadonlyArray<any>> = T['length']
`
    },
    {
      key: 'type-challenges-easy-6_exclude',
      name: '6 - Exclude',
      zenCode: `
type MyExclude<T, U> = T extends U ? never : T
`
    },
    {
      key: 'type-challenges-easy-7_awaited',
      name: '7 - Awaited',
      zenCode: `
type Awaited<T> = T == Promise<infer U> ? U : T
`
    },
    {
      key: 'type-challenges-easy-8_if',
      name: '8 - If',
      zenCode: `
type If<C: boolean, T, F> = C == true ? T : F
`
    },
    {
      key: 'type-challenges-easy-9_concat',
      name: '9 - Concat',
      zenCode: `
type Concat<T: any[], U: any[]> = [...T, ...U]
`
    },
    {
      key: 'type-challenges-easy-10_includes',
      name: '10 - Includes',
      zenCode: `
type Includes<T: ReadonlyArray<any>, U> = ^{
  if (T == [infer F, ...infer R]) {
    if (Equal<F, U> == true) {
      return true
    }
    return Includes<R, U>
  }
  return false
}
`
    },
    {
      key: 'type-challenges-easy-11_push',
      name: '11 - Push',
      zenCode: `
type Push<T: any[], U> = [...T, U]
`
    },
    {
      key: 'type-challenges-easy-12_unshift',
      name: '12 - Unshift',
      zenCode: `
type Unshift<T: any[], U> = [U, ...T]
`
    },
    {
      key: 'type-challenges-easy-13_parameters',
      name: '13 - Parameters',
      zenCode: `
type MyParameters<T> = ^{
  if (T == (...args: infer P) => any) {
    return P
  }
}
`
    }
  ]
} as const satisfies Example.Index;
