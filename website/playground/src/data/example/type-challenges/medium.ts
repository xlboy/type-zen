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
   * 14. Replace
   * 15. ReplaceAll
   * 16. Append Argument
   * 17. Permutation
   * 18. Length of String
   * 19. Flatten
   * 20. Append to object
   * 21. Absolute
   * 22. String to Union
   * 23. Merge
   * 24. KebabCase
   * 25. Diff
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
    },
    {
      key: 'type-challenges-medium-14_replace',
      name: '14 - Replace',
      zenCode: `
type Replace<S: string, From: string, To: string> = ^{
  type C = From == '' ? never : From

  if (S == \`\${infer L}\${C & string}\${infer R}\`) {
    return \`\${L}\${To}\${R}\`
  } else {
    return S
  }
}
`
    },
    {
      key: 'type-challenges-medium-15_replace-all',
      name: '15 - ReplaceAll',
      zenCode: `
type ReplaceAll<S: string, From: string, To: string> = ^{
  if (From == '') {
    return S
  }
  
  if (S == \`\${infer L}\${From}\${infer R}\`) {
    return \`\${L}\${To}\${ReplaceAll<R, From, To> & string}\`
  }

  return S
}
`
    },
    {
      key: 'type-challenges-medium-16_append-argument',
      name: '16 - Append Argument',
      zenCode: `
type AppendArgument<Fn, A> = ^{
  if (Fn == (...args: infer Args) => infer R) {
    return (...args: [...Args, A]) => R
  }
}
`
    },
    {
      key: 'type-challenges-medium-17_permutation',
      name: '17 - Permutation',
      zenCode: `
type Permutation<T, I = T> = ^{
  if ([T] == never[]) {
    return []
  }

  for (infer R in I) {
    return [R, ...Permutation<Exclude<T, R>>]
  }
}
`
    },
    {
      key: 'type-challenges-medium-18_length-of-string',
      name: '18 - Length of String',
      zenCode: `
type LengthOfString<S: string, Arr: any[] = []> = ^{
  if (S == \`\${infer F}\${infer Rest}\`) {
    return LengthOfString<Rest, [...Arr, F]>
  }

  return Arr['length']
}
`
    },
    {
      key: 'type-challenges-medium-19_flatten',
      name: '19 - Flatten',
      zenCode: `
type Flatten<T: any[]> = ^{
  if (T == [...infer K, infer R]) {
    if (R == any[]) {
      return [...Flatten<K>, ...Flatten<R>]
    } else {
      return [...Flatten<K>, R]
    }
  }

  return []
}
`
    },
    {
      key: 'type-challenges-medium-20_append-to-object',
      name: '20 - Append to Object',
      zenCode: `
type AppendToObject<T, U: string, V> = {
  [key in keyof T | U]: key == keyof T ? T[key] : V;
}
`
    },
    {
      key: 'type-challenges-medium-21_absolute',
      name: '21 - Absolute',
      zenCode: `
type Absolute<T: number | string | bigint> = ^{
  if (\`\${T}\` == \`-\${infer V}\`) {
    return V
  }
  return \`\${T}\`
}
`
    },
    {
      key: 'type-challenges-medium-22_string-to-union',
      name: '22 - String to Union',
      zenCode: `
type StringToUnion<T: string> = ^{
  if (T == \`\${infer A}\${infer B}\`) {
    return A | StringToUnion<B>
  }
}
`
    },
    {
      key: 'type-challenges-medium-23_merge',
      name: '23 - Merge',
      zenCode: `
type Merge<F: object, S: object> = {
  [key in keyof F | keyof S]: ^{
    if (key == keyof S) {
      return S[key]
    } else if (key == keyof F) {
      return F[key]
    }
  }
}      
`
    },
    {
      key: 'type-challenges-medium-24_kebab-case',
      name: '24 - KebabCase',
      zenCode: `
type KebabCase<S: string> = ^{
  if (S == \`\${infer F}\${infer R}\`) {
    if (R == Uncapitalize<R>) {
      return \`\${Lowercase<F>}\${KebabCase<R>}\`
    } else {
      return \`\${Lowercase<F>}-\${KebabCase<R>}\`
    }
  }

  return S
}
`
    },
    {
      key: 'type-challenges-medium-25_diff',
      name: '25 - Diff',
      zenCode: `
type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>
`
    }
  ]
} as const satisfies Example.Index;
