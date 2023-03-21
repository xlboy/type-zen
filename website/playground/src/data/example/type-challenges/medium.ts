import type { Example } from '../types';

export const tcMediumExample = {
  key: 'type-challenges-medium',
  name: 'Medium',
  /**
   * 1. Get Return Type
   * 2. Omit
   * 3. Readonly-2
   * 4. Deep Readonly
   * 5. Tuple to Union
   * 6. Chainable Options
   * 7. Last of Array
   * 8. Pop
   * 9. Promise.all
   * 10. Type Lookup
   * 11. Trim Left
   * 12. Trim
   * 13. Capitalize
   */
  children: [
    {
      key: 'type-challenges-medium-1_get-return-type',
      name: '1 - Get Return Type',
      zenCode: `
type MyReturnType<T> = ^{
  if (T == (...args: any[]) => infer U) {
    return U
  }
}
`
    },
    {
      key: 'type-challenges-medium-2_omit',
      name: '2 - Omit',
      zenCode: `
type MyOmit<T, K: keyof T> = {
  [_K in (keyof T) as _K == K ? never : _K] : T[_K]
}
`
    },
    {
      key: 'type-challenges-medium-3_readonly-2',
      name: '3 - Readonly-2',
      zenCode: `
type MyReadonly2<T, K: keyof T = keyof T> = 
  { readonly [P in K]: T[P] } 
  & 
  { [P in keyof T as P == K ? never : P]: T[P] }
`
    },
    {
      key: 'type-challenges-medium-4_deep-readonly',
      name: '4 - Deep Readonly',
      zenCode: `
type DeepReadonly<T> = {
  readonly [K in keyof T]: ^{
    if (keyof T[K] == never) {
      return T[K]
    }
    return DeepReadonly<T[K]>
  }
}
`
    },
    {
      key: 'type-challenges-medium-5_tuple-to-union',
      name: '5 - Tuple to Union',
      zenCode: `
type TupleToUnion<T: any[]> = T == Array<infer U> ? U : never
`
    },
    {
      key: 'type-challenges-medium-6_chainable-options',
      name: '6 - Chainable Options',
      zenCode: `
type Chainable<T = {}> = {
  option<K: string, V>(
    key: K == keyof T ? never : K,
    value: V
  ): Chainable<Omit<T, K> & { [P in K]: V }>;
  get(): T;
};
      `
    },
    {
      key: 'type-challenges-medium-7_last-of-array',
      name: '7 - Last of Array',
      zenCode: `
type Last<T: any[]> = T == [...infer _, infer R] ? R : never
`
    },
    {
      key: 'type-challenges-medium-8_pop',
      name: '8 - Pop',
      zenCode: `
type Pop<T: any[]> = ^{
  if (T == [...infer R, any]) {
    return R
  } else if (T == []) {
    return []
  }
}

`
    },
    {
      key: 'type-challenges-medium-9_promise-all',
      name: '9 - Promise.all',
      zenCode: `
declare function PromiseAll<T: any[]>(
  values: readonly [...T]
): Promise<{
  [P in keyof T]: Awaited<T[P]>;
}>;
`
    },
    {
      key: 'type-challenges-medium-10_type-lookup',
      name: '10 - Type Lookup',
      zenCode: `
type LookUp<U, T> = ^{
  for (infer Item in U) {
    if (Item == { type: T }) {
      return Item
    }
  }
}
`
    },
    {
      key: 'type-challenges-medium-11_trim-left',
      name: '11 - Trim Left',
      zenCode: `
type IgnoreString = ' ' | '\\n' | '\\t'
type TrimLeft<S: string> = ^{
  if (S == \`\${infer L extends IgnoreString}\${infer R}\`) {
    return TrimLeft<R>
  }

  return S
}
`
    },
    {
      key: 'type-challenges-medium-12_trim',
      name: '12 - Trim',
      zenCode: `
type IgnoreString = ' ' | '\\n' | '\\t'
type Trim<S: string> = ^{
  if (S == \`\${IgnoreString}\${infer W}\` | \`\${infer W}\${IgnoreString}\`) {
    return Trim<W>
  }

  return S
}
`
    },
    {
      key: 'type-challenges-medium-13_capitalize',
      name: '13 - Capitalize',
      zenCode: `
type MyCapitalize<S: string> = ^{
  if (S == \`\${infer U}\${infer R}\`) {
    return \`\${Uppercase<U>}\${R}\`
  } else {
    return S
  }
}
`
    }
  ]
} as const satisfies Example.Index;
