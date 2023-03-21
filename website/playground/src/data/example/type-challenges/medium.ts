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
    }
  ]
} as const satisfies Example.Index;
