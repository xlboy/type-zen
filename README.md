# type-zen

一个基于 TypeScript 类型层的语言，解决复杂类型代码带来的一系列体验问题。

# 示例

## 联合

> 使用 `|` 与 **常写的数组** 进行组合来表达

```ini
type A = | [1, 3, 5]
```

↓

```typescript
type A = 1 | 3 | 5;
```

## 交叉

> 使用 `&` 与 **常写的数组** 进行组合来表达

```ini
type A = & [1, 3, 5]
```

↓

```typescript
type A = 1 & 3 & 5;
```

## 约束符

### 泛型参数领域

> 在类型泛型参数声名处，可使用 `:` 代替 `extends`（减少 `extends` 关键字频繁出现带来的不好的视觉体验）

```ini
type MyOmit<T: object, K: keyof T, AllKey: keyof T = keyof T> = {
  [key in AllKey extends K ? never : AllKey]: T[key];
};
```

↓

```typescript
type MyOmit<T extends object, K extends keyof T, AllKey extends keyof T = keyof T> = {
  [key in AllKey extends K ? never : AllKey]: T[key];
};
```

### 主体领域

> 在类型主体中，可使用 `==` 代替 `extends`（减少 `extends` 关键字频繁出现带来的不好的视觉体验）

```ini
type IsNumber<V> = V == number ? true : false
```

↓

```typescript
type IsNumber<V> = V extends number ? true : false;
```

### 糖块

> 具有特定语义的代码块，可简化代码的书写

糖块的作用域处于 `^{` 与 `}` 中，或是 `if`、`for` 语句中。

> :warning: **它必须含有 `return 语句`**

- [基本的 `^{}`](https://type-zen-playground.vercel.app/?code=K6ksSFVwVLBViKvmUlAoAfGcgDxDGMcZyDHiAvKKUktKi%252FIUop10FJx1FJQyMpViuWoB)

  ```ini
  type A = ^{
    type B = 1
    type C = 2

    return [B, C, "hi"]
  }
  ```

  ↓

  ```typescript
  type A = [1, 2] extends [infer B, infer C] ? [B, C, 'hi'] : never;
  ```

- [搀杂 `if` 语句](https://type-zen-playground.vercel.app/?code=K6ksSFVwVLBViKvmUlAoAfGcgDxDGMcZyDHiAvIy0xQ0gDK2CsUlRZl56ZoKIPUKCkWpJaVFeQrRSk4KmcVQOSUdBedYoGwtSB%252Bqgrz8EhRFtQA%253D)

  ```ini
  type A = ^{
  type B = 1
  type C = 2

  if (B == string) {
    return ["B is string", C]
  }
  return ["B is not string", C]
  }
  ```

  ↓

  ```typescript
  type A = [1, 2] extends [infer B, infer C]
    ? (B extends string ? ['B is string', C] : UnreturnedSymbol) extends infer r_ugfq
      ? r_ugfq extends UnreturnedSymbol
        ? ['B is not string', C]
        : r_ugfq
      : never
    : never;
  ```

[一个更复杂的例子](https://type-zen-playground.vercel.app/?code=jVLbasIwGL7vU3x4MdwrWFtxF4IURLDspnSj6t8RFhNJ00HZ%252Bu5LrLOJVlkvCkm%252B03%252FQzZGwFBXb01pJLbU5T9MYEd6%252BA8AekVCzYFyTmib2IUEUYaTlRismPkb4wWgnD0fGaYQZBH2RwgRJaOiKdK0ErBKQJWACn9TIEimKytPNZ5PO0X4n1%252B6J9q8Fr8nYrqRY1ZwXW24CZkkeh8EZzkqMr9AR5pv0pajoGX%252BilzQpVXol950KnlCIJj5jWhCvaFhwUYudZlIMKHZFh%252F8QMV5Z7iqUUmHMRGl6tjihlpoOtk8eNRP1YUvKY57r7knDRTsx50oVzfRSvq07dnBtcIfhi2Xvzhx7e2%252BAbkJ3bj3cqOTxg8hD83IG1WcecPRdrEnXYHvzwOeqiWaXPWez0xYR3iS4d2r7sK2%252FGjcLtC6UZgXv9jpwOfbfBu0v)：

```ini
type InsidePrototype<T> = ^{
  type KeyFilter<K> = K == "toString" | "compile" ? never : K;
  return {
    [K in keyof T as KeyFilter<K>]?: ^{
      type FilteredValue = NonNullable<T[K]>;

      if (FilteredValue == ASTBase) {
        return TestNode<T[K] & any>
      } else if (FilteredValue == Function) {
        return  never;
      } else if (FilteredValue == any[]) {
        for (infer FValueItem in FilteredValue[number]) {
          if (FValueItem == ASTBase) {
            return Array<TestNode<any>>
          }
          return Array<{
            [_K in keyof FValueItem]?: ^{
              if (NonNullable<FValueItem[_K]> == ASTBase) {
                return TestNode<any>
              }

              if (FValueItem[_K] == infer Item) {
                return Item == ASTBase ? TestNode<any> : Item;
              }
            }
          }>
        }
      } else {
        return Partial<T[K]>
      }
    }
  }
}
```

↓

```typescript
type $_InsidePrototype_SugarBlock__KeyFilter__r_84ow<K> = K extends 'toString' | 'compile'
  ? never
  : K;
type InsidePrototype<T> = {
  [K in keyof T as $_InsidePrototype_SugarBlock__KeyFilter__r_84ow<K>]?: [
    NonNullable<T[K]>
  ] extends [infer FilteredValue]
    ? FilteredValue extends ASTBase
      ? TestNode<T[K] & any>
      : FilteredValue extends Function
      ? never
      : FilteredValue extends any[]
      ? FilteredValue[number] extends infer FValueItem
        ? (
            FValueItem extends ASTBase ? Array<TestNode<any>> : UnreturnedSymbol
          ) extends infer r_1v5l
          ? r_1v5l extends UnreturnedSymbol
            ? Array<{
                [_K in keyof FValueItem]?: (
                  NonNullable<FValueItem[_K]> extends ASTBase
                    ? TestNode<any>
                    : UnreturnedSymbol
                ) extends infer r_14d2
                  ? r_14d2 extends UnreturnedSymbol
                    ? FValueItem[_K] extends infer Item
                      ? Item extends ASTBase
                        ? TestNode<any>
                        : Item
                      : never
                    : r_14d2
                  : never;
              }>
            : r_1v5l
          : never
        : never
      : Partial<T[K]>
    : never;
};
```

# TODO

- expression

  - [x] literal :
        number, string, ...(keyword: [any, boolean, null, never, ...])

  - [x] condition :
        `a == 1 ? 1 : 2`, `a extends 1 ? 1 : 2`

  - [x] bracket surround : `(123)`

  - [x] tuple

  - [x] array : `number[]`

  - [x] object

  - [x] function

  - [x] keyof

  - [x] infer

  - [x] union :
        `1 | 2 | 3`, `| [1, 2, 3]`

  - [x] intersection :
        `1 & 2 & 3`, `& [1, 2, 3]`

  - [x] generic args :
        `<A extends string = "default">`, `<A: string = "default">`

  - [x] type reference :
        `A`, `Array<1>`, `IsNumber<"">`

  - [x] element access :
        `A["b"]`, `A[0][Key]`

  - [x] property access :
        `A.B`, `A.B.C`

  - sugar block : `^{ ... }`

    - [x] local variable statement :
          `^{ type B = 1; ... }`

    - if statement

      - [x] only if :
            `^{ if (a == 1) { do something... } }`

      - [x] if else :
            `^{ if (a == 1) { do something... } else { do something... } ... }`

      - [x] if else if :
            `^{ if (a == 1) { do something... } else if (a == 2) { do something... } ... }`

      - [ ] multiple condition :
            `^{ if (a == 1 && b == 2) { do something... } ... }`
            `^{ if (a == 1 || b == 2) { do something... } ... }`

    - [x] for statement :
          `^{ for (infer a in UnionValue) { do something... } ... }`

    - [x] return statement :
          `^{ ... return 1; }`

    - [ ] switch statement :
          `^{ switch (a) { case 0, case 1: do something...; case 2, case 3: do something...; } ... }`

  - [x] template string:

        `A is ${A}`

        `A is ${|[333, 222]} and B is ${B}`

        PS: The expressions inside `${}` only support native TS expression (extended expression are not currently supported).

  - [x] comment :

        `// xxxxxxxxx`

        `/* x
          xxxx
          xxxxxxxx
         */`

- statement

  - [x] type alias :
        `type A = 1`
  - [x] interface :
        `interface A { b: 1 }`

  - [x] enum:
        `enum A { B = 1, C = "" }`
        `const enum A { B = 1, C = "" }`

  - [ ] namespace: `namespace A { ... }`

  - [x] declare function:
        `declare function A(): 1`

  - [x] declare variable:
        `declare const A: 1`
        `declare let A: 1`
        `declare var A: 1`
