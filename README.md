# type-zen

A language based on TypeScript type system, which solves a series of experience problems caused by writing complex type code.

English | [简体中文](./README.zh.md)

## [HelloWorld](https://type-zen-playground.vercel.app/?code=XY%252FBDoIwEETv%252FYo5akLgjoIHEj%252BggXho6sFYpFFbU7YxRvl3KQgmHDbZzc6b2aXXQ%252BGgqbGetmUKb67GPo2QEaoUxt9PyuHza4TMkeH4ZoCusSqRZRDa1L1kr11LEeI4HmeuWpJrBClAIYQXPVsFZDLDDpUYB4kU1QZJAq4vDaGw5qxJW8MGg5A2JAScF5Mv4BR5Z%252BYHQmp%252FeD5sO6hbq5ZS8b90SckRY6HYDJSs%252BwI%253D)

TypeZen：

```ts
type Without<T: unknown[], U: number | number[]> = ^{
  if (T == [infer First, ...infer Rest]) {
    type RC = U == number[] ? U[number] : U; // Right Condition

    if (First == RC) {
      return Without<Rest, U>
    } else {
      return [First, ...Without<Rest, U>]
    }
  }

  return T
}
```

TypeScript after conversion：

```ts
type Without<T extends unknown[], U extends number | number[]> = (
  T extends [infer First, ...infer Rest]
    ? [U extends number[] ? U[number] : U] extends [infer RC]
      ? First extends RC
        ? Without<Rest, U>
        : [First, ...Without<Rest, U>]
      : never
    : TZ_URS
) extends infer r_czl5
  ? r_czl5 extends TZ_URS
    ? T
    : r_czl5
  : never;
```

For more examples, please refer to [Playground](https://type-zen-playground.vercel.app)

## Features

* Compatible with TypeScript type syntax

* Unique syntax sugar

  + More similar to the syntax in `TS/JS` that is often written (understood in seconds~)

  + Writing complex type code is simpler, more efficient, and more readable

* Write and use immediately (Playground, CLI, VSCode Extension)

## How to use?

<details>
<summary>1. Import preset type file in a project</summary><br>

1. Install

```bash
npm i @type-zen/preset-type -D
```

2. Import in `tsconfig.json`

```json
  {
    "compilerOptions": {
      "types": ["@type-zen/preset-type"]
    }
  }
  ```

PS: Why use `@type-zen/preset-type` as a global type file? **Because the compiled TypeScript type may use some predefined types(e.g. [ `TZ_URS` ](https://github.com/xlboy/type-zen/blob/master/packages/preset-type/index.d.ts#L5), ...)**

---

</details>

2. Use different tools to code according to different scenarios

### [Playground](https://type-zen-playground.vercel.app/?code=09dX8EktUS9WSM8HAA%253D%253D)

![playground-image](https://user-images.githubusercontent.com/63690944/227758595-1fbab076-2422-46e3-9320-303d6db76cbf.png)

### [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=xlboy.TypeZen&ssr=false#overview)

![preview-1](https://user-images.githubusercontent.com/63690944/227786758-3d30bdd4-f173-4137-9253-63c8945523ec.gif)

[See the extension to learn more](https://marketplace.visualstudio.com/items?itemName=xlboy.TypeZen&ssr=false#overview)

### CLI (Under development)

...

### TS Plugin (To be developed)

```bash
# Directory structure
- index.ts
- tool-types.tzen
```

```ts
// path: index.ts
import type { Without } from './tool-types.tzen'
// or
import type { Without } from './tool-types'

type XX = Without<...>
```

```ts
// path: tool-types.tzen
export type Without<T> = ...
```

### [Unplugin](https://github.com/unjs/unplugin) (To be developed)

> Contains `Webpack` , `Vite` , `Rollup` , ...

Generate `.d.ts` , ...

## Tutorial & Examples

* [Basic](https://type-zen-playground.vercel.app/?example=basic)

* [Sugar](https://type-zen-playground.vercel.app/?example=sugar-local-variable)

* Type Challenges

  + [Easy (13+)](https://type-zen-playground.vercel.app/?example=type-challenges-easy-1_pick)

  + [Medium (80+)](https://type-zen-playground.vercel.app/?example=type-challenges-medium-1_get-return-type)

## Syntax

### Expression

#### Basic

| Name | Example | Supported |
| ---- | ---- | ---- | 
| `literal` | `number, string, ...(keyword: [any, boolean, null, never, ...])` | ✅ |
| `condition` | `a == 1 ? 1 : 2` -> `a extends 1 ? 1 : 2` <br /> `a extends 12 ? 13 : 233` | ✅  |
| `bracket surround` | `(123)` | ✅  |
| `tuple` | `[1, 2, 3]` | ✅  |
| `array` | `number[]` <br /> `string[][]` | ✅  |
| `object` | `{ a: 1, b: 2 }` , ...| ✅ |
| `function` | `(a: 1, b: 2) => 3` , ... | ✅  |
| `type-operator` | `keyof x` , `readonly x` , ...| ✅ | 
| `infer` | `infer x` <br /> `infer xx == xxx1` -> `infer xx extends xxx1` <br /> `infer xx extends xxx` | ✅ | 
| `union` | `1 \| 2 \| 3` <br /> `\| [1, 2, 3]` | ✅ |
| `intersection` | `1 & 2 & 3` <br /> `& [11, 22, 33]` -> `11 & 22 & 33` | ✅ |
| `generic args` | `<S: string = "S">` -> `<S extends string = "S">` <br /> `<A extends string = "default">` | ✅ |
| `type reference` | `A` , `Array<1>` , `IsNumber<".">` | ✅ |
| `element access` | `A["b"]` , `A[0][Key]` | ✅ |
| `property access` | `A.B` , `A.B.C` | ✅ |
| `template string` | ` `  ` hello ${name} `  `  ` <br /> :warning:  ** ` ${} ` expressions only support TypeScript native expressions (Does not yet support extensions such as: ` ^{...} ` , ` \| [1, 3]` , ...)** | ✅ |
| `comment` | `// ...` <br /> `/* ... */` | ✅ |
 

#### Sugar Block

Sugar Block are a special type of expression that can be used to write type logic code (if, else, for, local variable declarations, etc.)

Sugar blocks are scoped to `^{` and `}` , or within `if,for` statements.

| Name | Example |   Supported | 
| ---- | ---- | ---- | 
| `local ` | `^{ type B = 1; ... }` | ✅ |
| `only if` | `^{ if (a == 1) { do something... } }` | ✅ |
| `if else` | `^{ if (a == 1) { do something... } else { do something... } ... }` | ✅ |
| `if else if` | `^{ if (a == 1) { do something... } else if (a == 2) { do something... } ... }` | ✅ |
| `multiple condition` | `^{ if (a == 1 && b == 2) { do something... } ... }` <br /> `^{ if (a == 1 \|\| b == 2) { do something... } ... }` | 
| `for` | `^{ for (infer a in UnionValue) { do something... } ... }` | ✅ |
| `return` | `^{ ... return 1; }` | ✅ |
| `switch` | `^{ switch (a) { case 0, case 1: do something...; case 2, case 3: do something...; } ... } ` | 

> :warning: if does not currently support `!=` logical symbol

> :warning: In a sugar block, it must contain a `return` statement.

### Statement

| Name | Example | Supported |
| ---- | ---- | ---- | 
| `type alias` | `type A = 1` | ✅ |
| `interface` | `interface A { b: 1 }` | ✅ |
| `enum` | `enum A { B = 1, C = "" }` <br /> `const enum A { B = 1, C = "" }` | ✅ |
| `namespace` | `namespace A { ... }` |  |
| `declare function` | `declare function A(): 1` | ✅ |
| `declare variable` | `declare const A: 1` <br /> `declare let A: 1` <br /> `declare var A: 1` | ✅ |
| `import` | `import type {} from '...'` <br /> ... |  |
| `export` | `export type { ... }` <br /> ... |  |

## Issues

...

## Thanks

* [typetype](https://github.com/mistlog/typetype)

* [n-lang](https://github.com/nbuilding/N-lang)

* [type-challenges](https://github.com/type-challenges/type-challenges)

And friends who have supported me~💛

## License

MIT
