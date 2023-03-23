import type { Example } from '../types';

export const tcMediumExample = {
  key: 'type-challenges-medium',
  name: 'Medium',
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
    },

    {
      key: 'type-challenges-medium-26_any-of',
      name: '26 - AnyOf',
      zenCode: `
type AnyOf<T: readonly any[]> = ^{
  type FalseValue = '' | 0 | false | [] | undefined | null | Record<keyof any, never>

  return T[number] == FalseValue ? false : true
}
`
    },
    {
      key: 'type-challenges-medium-27_is-never',
      name: '27 - IsNever',
      zenCode: `
type IsNever<T> = T[] == never[] ? true : false
`
    },
    {
      key: 'type-challenges-medium-28_is-union',
      name: '28 - IsUnion',
      zenCode: `
type IsUnion<U, U1 = U> = ^{
  if ([U] == [never]) {
    return false
  }
  
  for (infer I in U1) {
    return [U] == [I] ? false : true
  }
}
`
    },
    {
      key: 'type-challenges-medium-29_replace-keys',
      name: '29 - ReplaceKeys',
      zenCode: `
type ReplaceKeys<U, T, Y> = ^{
  if (U == any) {
    return {
      [key in keyof U]: ^{
        if (key == T) {
          if (key == keyof Y) {
            return Y[key]
          } 

          return never
        }

        return U[key]
      }
    }
  }
}
`
    },
    {
      key: 'type-challenges-medium-30_remove-index-signature',
      name: '30 - Remove Index Signature',
      zenCode: `
type RemoveIndexSignature<T> = ^{
  type FilterKey<K> = ^{
    if (string == K) {
      return never
    } else if (number == K) {
      return never
    } else if (symbol == K) {
      return never
    } else {
      return K
    }
  }

  return { [key in keyof T as FilterKey<key>]: T[key] }
}
`
    },
    {
      key: 'type-challenges-medium-31_percentage-parser',
      name: '31 - Percentage Parser',
      zenCode: `
type PercentageParser<A: string> = ^{
  type _PercentCheck<T> = T == \`\${infer L}%\` ? [L, '%'] : [T, ''];
  
  if (A == \`\${infer L}\${infer R}\`) {
    if (L == '+' | '-') {
      return [L, ..._PercentCheck<R>]
    } else {
      return ['', ..._PercentCheck<A>]
    }
  }

  return ['', ..._PercentCheck<A>]
}
`
    },
    {
      key: 'type-challenges-medium-32_drop-char',
      name: '32 - Drop Char',
      zenCode: `
type DropChar<S: string, C: string> = ^{
  if (S == \`\${infer F}\${infer R}\`) {
    if (F == C) {
      return DropChar<R, C>
    } else {
      return \`\${F}\${DropChar<R, C> & string}\`
    }
  }

  return S
}
`
    },
    {
      key: 'type-challenges-medium-33_minus-one',
      name: '33 - MinusOne',
      zenCode: `
// source code link: https://github.com/type-challenges/type-challenges/issues/24996

type NumberLiteral = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type MinusOneMap = {
  "0": "9";
  "1": "0";
  "2": "1";
  "3": "2";
  "4": "3";
  "5": "4";
  "6": "5";
  "7": "6";
  "8": "7";
  "9": "8";
};

type ReverseString<S: string> = ^{
  if (S == \`\${infer First}\${infer Rest}\`) {
    return \`\${ReverseString<Rest>}\${First}\`
  } else {
    return ""
  }
}

type RemoveLeadingZeros<S: string> = ^{
  if (S == '0') {
    return S
  } else if (S == \`\${'0'}\${infer R}\`) {
    return RemoveLeadingZeros<R>
  } else { 
    return S
  }
}

type Initial<T: string> = ^{
  if (ReverseString<T> == \`\${infer First}\${infer Rest}\`) {
    return ReverseString<Rest>
  } else {
    return T
  }
}

type ParseInt<T: string> = ^{
  if (RemoveLeadingZeros<T> == \`\${infer Digit extends number}\`) {
    return Digit
  }
}

type MinusOneForString<S: string> = ^{
  if (S == \`\${Initial<S>}\${infer Last extends NumberLiteral}\`) {
    if (Last == '0') {
      return \`\${MinusOneForString<Initial<S>>}\${MinusOneMap[Last]}\`
    } else {
      return \`\${Initial<S>}\${MinusOneMap[Last]}\`
    }
  }
}

type MinusOne<T: number> = ^{
  if (T == 0) {
    return -1
  } else {
    return ParseInt<MinusOneForString<\`\${T}\`>>
  }
}
`
    },
    {
      key: 'type-challenges-medium-34_pick-by-type',
      name: '34 - PickByType',
      zenCode: `
type PickByType<T, U> = {
  [K in keyof T as T[K] == U ? K : never]: T[K]
}
`
    },
    {
      key: 'type-challenges-medium-35_starts-with',
      name: '35 - StartsWith',
      zenCode: `
type StartsWith<T: string, U: string> = ^{
  if (T == \`\${U}\${infer R}\`) {
    return true
  } else {
    return false
  }
}
`
    },
    {
      key: 'type-challenges-medium-36_ends-with',
      name: '36 - EndsWith',
      zenCode: `
type EndsWith<T: string, U: string> = ^{
  if (T == \`\${string}\${U}\`) {
    return true
  } else {
    return false
  }
}
`
    },
    {
      key: 'type-challenges-medium-37_partial-by-keys',
      name: '37 - PartialByKeys',
      zenCode: `
type PartialByKeys<T, K: keyof T = keyof T> = ^{
  type Flatten<T> = { [key in keyof T]: T[key] };
  
  return Flatten<Omit<T, K> & { [P in K]?: T[P] }>
}
`
    },
    {
      key: 'type-challenges-medium-38_required-by-keys',
      name: '38 - RequiredByKeys',
      zenCode: `
type RequiredByKeys<T, K: keyof T = keyof T> = ^{
  type Flatten<T> = { [key in keyof T]: T[key] };
  type A = Required<Pick<T, K>>;
  type B = Partial<Omit<T, K>>;

  return Flatten<A & B>
}
`
    },
    {
      key: 'type-challenges-medium-39_mutable',
      name: '39 - Mutable',
      zenCode: `
type Mutable<T> = {
  -readonly [key in keyof T]: T[key];
}
`
    },
    {
      key: 'type-challenges-medium-40_omit-by-type',
      name: '40 - OmitByType',
      zenCode: `
type OmitByType<T, U> = {
  [P in keyof T as T[P] == U ? never : P]:T[P]
}
`
    },
    {
      key: 'type-challenges-medium-41_object-entries',
      name: '41 - ObjectEntries',
      zenCode: `
type ObjectEntries<T, _T = keyof T> = ^{
  for (infer K in _T) {
    return [
      K, 
      T[K] == (undefined | infer Type) ? Type : never
    ]
  }
}
`
    },
    {
      key: 'type-challenges-medium-42_shift',
      name: '42 - Shift',
      zenCode: `
type Shift<T: any[]> = T == [infer _, ...infer R] ? [...R] : [];
`
    },
    {
      key: 'type-challenges-medium-43_tuple-to-nested-object',
      name: '43 - TupleToNestedObject',
      zenCode: `
type TupleToNestedObject<T: any[], U> = ^{
  if (T == [infer First, ...infer Rest]) {
    if (First == string) {
      if (Rest['length'] == 0) {
        return Record<First, U>
      } else {
        return Record<First, TupleToNestedObject<Rest, U>>
      }
    } 
    
    return {}
  } 
  
  return U
}
`
    },
    {
      key: 'type-challenges-medium-44_reverse',
      name: '44 - Reverse',
      zenCode: `
type Reverse<T: any[], C: any[] = []> = ^{
  if (T == [infer F, ...infer R]) {
    return Reverse<R, [F, ...C]>
  } else {
    return C
  }
}
`
    },
    {
      key: 'type-challenges-medium-45_flip-arguments',
      name: '45 - FlipArguments',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/21378

type ReverseTuple<T> = ^{
  if (T == [...infer Heads, infer Tail]) {
    return [Tail, ...ReverseTuple<Heads>]
  } else {
    return []
  }
}

type FlipArguments<T: Function> = ^{
  if (T == (...args: infer TArguments) => infer TReturn) {
    return (...args: ReverseTuple<TArguments>) => TReturn
  }
}
`
    },
    {
      key: 'type-challenges-medium-46_flatten-depth',
      name: '46 - FlattenDepth',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25160

type Flatten<A: unknown[]> = ^{
  if (A == [infer X, ...infer Y]) {
    if (X == unknown[]) {
      return [...X, ...Flatten<Y>]
    } else {
      return [X, ...Flatten<Y>]
    }
  } else {
    return []
  }
}

type FlattenDepth<
  Target: unknown[],
  Depth: number = 1,
  Arr: unknown[] = []
> = ^{
  if (Arr['length'] == Depth) {
    return Target
  } else if (Flatten<Target> == Target) {
    return Target
  } 

  return FlattenDepth<
    Flatten<Target>,
    Depth,
    [unknown, ...Arr]
  >
}
`
    },
    {
      key: 'type-challenges-medium-47_bem-style-string',
      name: '47 - BEM Style String',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25161

type ConcatM<B: string, M: string[]> = ^{
  if (M['length'] == 0) {
    return B
  } else if (M[number] == M[number]) {
    return \`\${B}--\${M[number]}\`
  } 

  return B
}

type BEM<B: string, E: string[], M: string[]> = ^{
  if (E == [infer X == string]) {
    return ConcatM<\`\${B}__\${X}\`, M>
  } else {
    return ConcatM<B, M>
  }
}
`
    },
    {
      key: 'type-challenges-medium-48_inorder-traversal',
      name: '48 - InorderTraversal',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25163

interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

type InorderTraversal<T: TreeNode | null> = ^{
  if (T == TreeNode) {
    type L = T['left'] == TreeNode ? InorderTraversal<T['left']> : []
    type R = T['right'] == TreeNode ? InorderTraversal<T['right']> : []

    return [...L, T['val'], ...R]
  }

  return []
}
`
    },
    {
      key: 'type-challenges-medium-49_flip',
      name: '49 - Flip',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25218

type Flip<T: Record<PropertyKey, string | number | boolean>> = {
  [k in keyof T as \`\${T[k]}\`]: k
}
`
    },

    {
      key: 'type-challenges-medium-50_fibonacci-sequence',
      name: '50 - Fibonacci Sequence',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25219

type Fibonacci<
  T: number, // Target depth
  Cur: unknown[] = [], // Current array
  Prev: unknown[] = [unknown], // Previous array
  Count: unknown[] = [] // Count our current depth
> = ^{
  if (Count['length'] == T) {
    return Cur['length']
  } else {
    return Fibonacci<
      T,
      [...Cur, ...Prev],
      Cur,
      [unknown, ...Count]
    >
  }
}
`
    },
    {
      key: 'type-challenges-medium-51_all-combinations',
      name: '51 - AllCombinations',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25225

type StringToUnion<S: string> = ^{
  if (S == \`\${infer A}\${infer Rest}\`) {
    return A | StringToUnion<Rest>
  } else {
    return ''
  }
}

type Combinations<T: string, U: string = T> = ^{
  for (infer I in U) {
    return I | \`\${I}\${Combinations<Exclude<T, I>>}\`
  }
}

type AllCombinations<S: string> = Combinations<StringToUnion<S>>
`
    },
    {
      key: 'type-challenges-medium-52_greater-than',
      name: '52 - GreaterThan',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/21721#issuecomment-1399309754

type GreaterThanSameDigitCount<T: number | string, U: number | string> = ^{
  if (\`\${T}\` == \`\${infer TF}\${infer TR}\`) {
    if (\`\${U}\` == \`\${infer UF}\${infer UR}\`) {
      if (TF == UF) {
        return GreaterThanSameDigitCount<TR, UR>
      } else {
        type LC = '0123456789';
        type RC = \`\${string}\${TF}\${string}\${UF}\${string}\`
        
        return LC == RC ? false : true
      }
    } else {
      return true
    }
  } 

  return false
}

type DigitsToArr<S: string> = ^{
  if (S == \`\${string}\${infer R}\`) {
    return [0, ...DigitsToArr<R>]
  } else {
    return []
  }
}

type ArrLenCompare<T: any[], U: any[]> = ^{
  type LC = '0123456789';
  type RC1 = \`\${string}\${T['length']}\${string}\${U['length']}\${string}\`
  type RC2 = \`\${string}\${U['length']}\${string}\${T['length']}\${string}\`

  if (LC == RC1) {
    return -1
  } else if (LC == RC2) {
    return 1
  } 

  return 0
}

type GreaterThan<T: number, U: number> = ^{
  type LC = ArrLenCompare<DigitsToArr<\`\${T}\`>, DigitsToArr<\`\${U}\`>>

  if (LC == 0) {
    return GreaterThanSameDigitCount<T, U>
  } else if (LC == 1) {
    return true
  }

  return false
}
`
    },
    {
      key: 'type-challenges-medium-53_zip',
      name: '53 - Zip',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25228

type Zip<T: unknown[], U: unknown[]> = ^{
  if (T == [infer X, ...infer Y]) {
    if (U == [infer A, ...infer B]) {
      return [[X, A], ...Zip<Y, B>]
    }
  }

  return []
}
`
    },
    {
      key: 'type-challenges-medium-54_is-tuple',
      name: '54 - IsTuple',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/24268

type IsTuple<T> = ^{
  if ([T] == [never]) {
    return false
  }

  if (T == readonly unknown[]) {
    return number == T['length'] ? false : true
  }

  return false
}
`
    },

    {
      key: 'type-challenges-medium-55_chunk',
      name: '55 - Chunk',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25299

type FixLengthTuple<N: number, A: any[] = []> = ^{
  if (A['length'] == N) {
    return A
  } else {
    return FixLengthTuple<N, [...A, any]>
  }
}

type Chunk<T: any[], U: number> = ^{
  if (T == [...FixLengthTuple<U>, ...infer Rest]) {
    if (T == [...infer R, ...Rest]) {
      return [R, ...Chunk<Rest, U>]
    } else {
      return []
    }
  }

  if (T == []) {
    return []
  }

  return [T]
}
`
    },
    {
      key: 'type-challenges-medium-56_fill',
      name: '56 - Fill',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/24339

type Fill<
  T: unknown[],
  N,
  Start: number = 0,
  End: number = T['length'],
  I: number[] = [],
  S: boolean = false
> = ^{
  if (T == [infer F, ...infer R]) {
    if (I['length'] == End) {
      return T
    }
    

    if (I['length'] == Start) {
      type C = Fill<R,N,Start,End,[...I,I['length']],true>
      return [N, ...C]
    } else {
      type C = Fill<R,N,Start,End,[...I,I['length']],S>
      return [S == true ? N : F, ...C]
    }
  }

  return T
}
`
    },
    {
      key: 'type-challenges-medium-57_trim-right',
      name: '57 - TrimRight',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/24769

type TrimRight<S: string> = ^{
  type WhiteSpace = ' ' | '\t' | '\\n';

  if (S == \`\${infer W}\${WhiteSpace}\`) {
    return TrimRight<W>
  } else {
    return S
  }
}
`
    },
    {
      key: 'type-challenges-medium-58_without',
      name: '58 - Without',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/24270

type Without<T: unknown[], U: number | number[]> = ^{
  if (T == [infer First, ...infer Rest]) {
    type RC = U == number[] ? U[number] : U;

    if (First == RC) {
      return Without<Rest, U>
    } else {
      return [First, ...Without<Rest, U>]
    }
  }

  return T
}
`
    },
    {
      key: 'type-challenges-medium-59_trunc',
      name: '59 - Trunc',
      zenCode: `
type Trunc<T: number | string> = ^{
  type StrT = \`\${T}\`

  if (StrT == \`.\${infer Right}\`) {
    return '0'
  }

  if (StrT == \`\${infer Left}.\${infer Right}\`) {
    return Left
  }

  return StrT
}
`
    },
    {
      key: 'type-challenges-medium-60_index-of',
      name: '60 - IndexOf',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/24273

type IndexOf<T: unknown[], U, Acc: unknown[] = []> = ^{
  if (T == [infer First, ...infer Rest]) {
    if (Equal<First, U> == true){
      return Acc['length']
    } else {
      return IndexOf<Rest, U, [...Acc, 1]>
    }
  }

  return -1
}
`
    },
    {
      key: 'type-challenges-medium-61_join',
      name: '61 - Join',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25317

type Join<T: string[], U: string | number> = ^{
  if (T == [infer Head == string, ...infer Tail == string[]]) {
    type C = Tail['length'] == 0 ? '' : U

    return \`\${Head}\${C}\${Join<Tail, U>}\`
  }

  return ''
}
`
    },
    {
      key: 'type-challenges-medium-62_last-index-of',
      name: '62 - LastIndexOf',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/25232

type LastIndexOf<T: unknown[], U> = ^{
  if (T == [...infer Head, infer Tail]) {
    if (Equal<Tail, U> == true) {
      return Head['length']
    } else {
      return LastIndexOf<Head, U>
    }
  }

  return -1
}
`
    },
    {
      key: 'type-challenges-medium-63_unique',
      name: '63 - Unique',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/22282

type Includes<T: readonly any[], U> = ^{
  if (T == [infer F, ...infer L]) {
    if (Equal<U, F> == true) {
      return true
    } else {
      return Includes<L, U>
    }
  }

  return false
}

type Unique<T: any[], U: any[] = []> = ^{
  if (T == [infer F, ...infer L]) {
    if (Includes<U, F> == true) {
      return [...Unique<L, [...U]>]
    } else {
      return [F, ...Unique<L, [...U, F]>]
    }
  }

  return T
}
`
    },
    {
      key: 'type-challenges-medium-64_map-types',
      name: '64 - MapTypes',
      zenCode: `
// answer source: https://github.com/type-challenges/type-challenges/issues/24847

type MapTypes<
  T: Record<string, unknown>,
  R: { mapFrom: unknown; mapTo: unknown }
> = {
  [P in keyof T]: ^{
    if (T[P] == R['mapFrom']) {
      if (R == { mapFrom: T[P] }) {
        return R['mapTo']
      } else {
        return never
      }
    }

    return T[P]
  }
}
`
    }
  ]
} as const satisfies Example.Index;
