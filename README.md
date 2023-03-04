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
type A = 1 | 3 | 5
```

## 交叉

> 使用 `&` 与 **常写的数组** 进行组合来表达

```ini
type A = & [1, 3, 5]
```
↓
```typescript
type A = 1 & 3 & 5
```

## 约束符

###  泛型参数领域

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
type IsNumber<V> = V extends number ? true : false
```

### 糖块
> 具有特定语义的代码块，可简化代码的书写

糖块的作用域处于 `^{` 与 `}` 中，或是 `if`语句中。


> :warning: **它必须含有 `return 语句`**。在糖块中，如果 return 语句不成对，会默认使用 `never 值` 补全（自动返回其值）

- 基本的 `^{}`

   ```ini
   type A = ^{
     type B = 1
     type C = 2
       
     return { B, C }
   }
   ```
   ↓ 
   ```typescript
   type A = [1, 2] extends [infer B, infer C] ? { B: B, C: C } : never
   ```

- 搀杂 `if` 语句

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
   type A = [1, 2] extends [infer B, infer C] ? B extends string ? ["B is string", C] : ["B is not string", C] : never
   ```

一个更复杂的例子：

```ini
type InsidePrototype<T> = ^{
  type KeyFilter<K> = K == "toString" | "compile" ? never : K;

  return {
    [K in keyof T as KeyFilter<K>]?: ^{
      type FilteredValue = NonNullable<T[K]>;

      if (FilteredValue == ast.Base) {
        return TestNode<T[K] & any>
      } else if (FilteredValue == Function) {
        return  never;
      } else if (FilteredValue == any[]) {
        for (infer FValueItem of FilteredValue[number]) {
          if (FValueItem == ast.Base) {
            return Array<TestNode<any>>
          }
          return Array<{
            [_K in keyof FValueItem]?: ^{
              if (NonNullable<FValueItem[_K]> == ast.Base) {
                return TestNode<any>
              }
    
              if (FValueItem[_K] == infer Item) {
                return Item == ast.Base ? TestNode<any> : Item;
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
type $_InsidePrototype_KeyFilter<K> = K extends "toString" | "compile" ? never : K;
type InsidePrototype<T> = {
  [K in keyof T as $_InsidePrototype_KeyFilter<K>]?: [
    NonNullable<T[K]>
  ] extends [infer FilteredValue]
    ? FilteredValue extends ast.Base
      ? TestNode<T[K] & any>
      : FilteredValue extends Function
      ? never
      : FilteredValue extends any[]
      ? FilteredValue[number] extends infer FValueItem
        ? FValueItem extends ast.Base
          ? Array<TestNode<any>>
          : Array<{
              [_K in keyof FValueItem]?: NonNullable<
                FValueItem[_K]
              > extends ast.Base
                ? TestNode<any>
                : FValueItem[_K] extends infer Item
                ? Item extends ast.Base
                  ? TestNode<any>
                  : Item
                : never;
            }>
        : never
      : Partial<T[K]>
    : never;
};
```
