# type-zen

一个基于 TypeScript 类型层的语言，为解决编写复杂类型代码时带来的一系列体验问题。

[English](./README.md) | 简体中文

## Helloworld

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

转换后的 TypeScript：

```ts
type Without<T extends unknown[], U extends number | number[]> = (
  T extends [infer First, ...infer Rest]
    ? [U extends number[] ? U[number] : U] extends [infer RC]
      ? First extends RC
        ? Without<Rest, U>
        : [First, ...Without<Rest, U>]
      : never
    : UnreturnedSymbol
) extends infer r_8o98
  ? r_8o98 extends UnreturnedSymbol
    ? T
    : r_8o98
  : never;
```

更多示例请查看 [Playground](https://type-zen-playground.vercel.app)

## 特性

* 兼容 TypeScript 类型语法

* 独特的语法糖

  + 与常写的 `TS/JS` 中的语法较为相似（看了秒懂~）

  + 编写复杂类型代码更加简单、高效、可读

* 即写即用（Playground、CLI、VSCode 扩展）

## 如何使用？

<details>
<summary>1. 在项目中引入预设类型文件</summary><br>

1. 安装

```bash
npm i @type-zen/preset-type -D
```

2. 在 `tsconfig.json` 中引入

```json
  {
    "compilerOptions": {
      "types": ["@type-zen/preset-type"]
    }
  }
  ```

PS: 为什么要使用 `@type-zen/preset-type` 作为全局类型文件？ **因为编译后的 TypeScript 类型可能会用到一些预先定义好的类型（例如：[ `TZ_URS` ](https://github.com/xlboy/type-zen/blob/master/packages/preset-type/index.d.ts#L5), ...)**

---
</details>

2. 根据不同场景采用以下不同的工具来编写

### [Playground](https://type-zen-playground.vercel.app/?code=09dX8EktUS9WSM8HAA%253D%253D)

![playground-image](https://user-images.githubusercontent.com/63690944/227758595-1fbab076-2422-46e3-9320-303d6db76cbf.png)

### [VSCode 扩展](https://marketplace.visualstudio.com/items?itemName=xlboy.TypeZen&ssr=false#overview)

![preview-1](https://user-images.githubusercontent.com/63690944/227786758-3d30bdd4-f173-4137-9253-63c8945523ec.gif)

[查看扩展以了解更多信息](https://marketplace.visualstudio.com/items?itemName=xlboy.TypeZen&ssr=false#overview)

### CLI （开发中）

...

### TS Plugin (待开发)

```bash
# Directory structure
- index.ts
- tool-types.tzen
```

```typescript
// path: index.ts
import type { Without } from './tool-types.tzen'
// or
import type { Without } from './tool-types'

type XX = Without<...>
```

```typescript
// path: tool-types.tzen
export type Without<T> = ...
```

### [Unplugin](https://github.com/unjs/unplugin) (待开发)

> Contains `Webpack` , `Vite` , `Rollup` , ...

Generate `.d.ts` , ...

## 教程&示例

* [Basic](https://type-zen-playground.vercel.app/?example=basic)

* [Sugar](https://type-zen-playground.vercel.app/?example=sugar-local-variable)

* Type Challenges

  + [Easy (13+)](https://type-zen-playground.vercel.app/?example=type-challenges-easy-1_pick)

  + [Medium (80+)](https://type-zen-playground.vercel.app/?example=type-challenges-medium-1_get-return-type)

## 语法

### 表达式

#### 基本的

| 名称 | 示例 | 支持 |
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
| `template string` | ` `  ` hello ${name} `  `  ` <br /> :warning:  ** ` ${} ` 中的表达式仅支持 TypeScript 原生表达式（*暂不支持扩展的，如： ` ^{...} ` , ` \| [1, 3]` , ...*）** | ✅ |
| `comment` | `// ...` <br /> `/* ... */` | ✅ |
 

#### 糖块（Sugar Block）

糖块是一种特殊的表达式，可以利用它来编写类型逻辑代码（if, else, for, 局部变量声明等）

糖块的作用域处于 `^{` 与 `}` 中，或是 `if` 、 `for` 语句中。

| 名称 | 示例 |   支持 | 
| ---- | ---- | ---- | 
| `local ` | `^{ type B = 1; ... }` | ✅ |
| `only if` | `^{ if (a == 1) { do something... } }` | ✅ |
| `if else` | `^{ if (a == 1) { do something... } else { do something... } ... }` | ✅ |
| `if else if` | `^{ if (a == 1) { do something... } else if (a == 2) { do something... } ... }` | ✅ |
| `multiple condition` | `^{ if (a == 1 && b == 2) { do something... } ... }` <br /> `^{ if (a == 1 \|\| b == 2) { do something... } ... }` | 
| `for` | `^{ for (infer a in UnionValue) { do something... } ... }` | ✅ |
| `return` | `^{ ... return 1; }` | ✅ |
| `switch` | `^{ switch (a) { case 0, case 1: do something...; case 2, case 3: do something...; } ... } ` | 

> :warning: if 暂不支持 `!=` 逻辑符

> :warning: 糖块中，必须含有 `return`

### 语句

| 名称 | 示例 | 支持 |
| ---- | ---- | ---- | 
| `type alias` | `type A = 1` | ✅ |
| `interface` | `interface A { b: 1 }` | ✅ |
| `enum` | `enum A { B = 1, C = "" }` <br /> `const enum A { B = 1, C = "" }` | ✅ |
| `namespace` | `namespace A { ... }` |  |
| `declare function` | `declare function A(): 1` | ✅ |
| `declare variable` | `declare const A: 1` <br /> `declare let A: 1` <br /> `declare var A: 1` | ✅ |
| `import` | `import type {} from '...'` <br /> ... |  |
| `export` | `export type { ... }` <br /> ... |  |

## 问题

...

## 致谢

* [typetype](https://github.com/mistlog/typetype)

* [n-lang](https://github.com/nbuilding/N-lang)

* [type-challenges](https://github.com/type-challenges/type-challenges)

以及给予过支持的朋友们~💛

## License

MIT
