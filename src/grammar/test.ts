import nearley from 'nearley';

import { compiler } from '../compiler';
import langGrammar from './__lang.auto-generated__';

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(langGrammar));

try {
  // const content = `type ppp = false | "11" | 'dfdf'`;
  // const content = `type ppp = | [string, true, 2, 3, 5, ""]`;
  // const content = `type ppp =        string
  // ;;;;;;;type ppp_2 =    "nnnnn"
  // type u2 = 11 | "fa" | true;
  // type u = | [1, true, "str", boolean, never];
  // `;
  // const content = `type B = 0 | 8[];`;
  // const content = `type B = 0 extends 8 ? 1921291 : 1.11[];`
  // const content = `type A = () => asserts this is 0 extends 8 ? 1921291 : 1.11;`

  // const content = `

  // new (a: string): void;
  // name: string;
  // age?: number;
  // [key: string]: any;
  // type A = [...string];
  // type B = [id: string, b: Array]
  // type C = [...b: any[]]
  // type D = [...any[]]
  // `
  // const content = `type A = infer u77S4Qw4EcXXeR6NGmvuWY extends Required[8 | false];`;
  // const content2 =
  //   "type A = { [QgZDIA9G5h2A0jYGV3F9 in ([...undefined | void, WDQ2SyynXd6zztx: | [true, ReturnType],])] -?: (ssT0utkp1VE: | [`wwlklksdldfs.1111`, $], ...eg9xKgLDDkge: | [false, unknown]) => xGFkEqLuJa is gQ$AdCtdFHLtyNKrX2yCrr2D6fy | ___$1 }";
  /**
     enum a {};
  const enum a {};
  enum A {
    a = 1
  }

  $_A_a_s_arrow_fn_rt_ 
   */
  const content = `
  type Name = "xlboy"

  type A<T> = ^{
    if (T == Name) {
      return "这是我的名称"
    } else if (T == number) {
      if (T == 1) {
        return "传了个 数字1 进来"
      }
      return "传了个其他数字进来"
    }

    return ["即不是 number 也不是名？…是 ->", T]
  }

  type Test1 = A<"xlboy">
  type Test2 = A<1>
  type Test3 = A<2333>
  type Test4 = A<| [":)", "酷酷酷"]>
  `;

  //
  //

  // const content = `type A = 0 extends () => asserts this is 0 ? 1921291 : 1.11;`
  // const content = `type A = 0 extends 8 ? 1921291 : () => asserts this is 0;`
  // const content = `type A = "111" | name[string]`;

  // const content = `type is = () => this is true | false`;
  // const content = `type u_ = '1' | 2;`
  // const content = `type aaaa = SSSwcgj<string>`;
  // console.log(content);

  console.time('parser feed');
  parser.feed(content);
  console.timeEnd('parser feed');

  if (parser.results.length !== 0) {
    console.log(compiler.compile(parser.results[0]).toText());

    // for (const result of parser.results[0]) {
    // console.log(`结果： ${JSON.stringify(result.compile())}`);
    // }
  }

  if (parser.results.length !== 1) {
    parser.results.some((item, index, arr) => {
      if (index > 100) return true;
      console.log(`结果： ${JSON.stringify(item[0].compile())}`);

      // console.error('语法错误', item === arr[index + 1]);
    });
  }
} catch (error: any) {
  const lineColRegex =
    /^(?:invalid syntax|Syntax error) at line (\d+) col (\d+):\n\n {2}[^\n]+\n {2,}\^/;
  const basedOnRegex = /A ("(?:[^"]|\\")+"|.+ token) based on:/g;

  const nearleyMsg = error.message.replace(lineColRegex, '');

  console.error(error);
}

type i = 1;

// @ts-ignore
declare var ab1;
declare var ab2: void;
declare let ab3: any;
declare const ab4: any;
declare function s(): any;
declare const fn1: (a: string, b: number) => boolean;
declare function fn2(a: string, b: number): boolean | typeof fn1;
type fn3 = (a: string, b: number) => boolean;
type fn4 = new (a: string, b: number) => boolean;
type fn5 = {
  (a: string, b: number): boolean;
  new (a: string, b: number): boolean;
  a: new (a: string, b: number) => boolean;
  b?(a: string, b: number): boolean;
};
type fn6 = {
  a(): void;
};
type fn7 = {
  a: () => void;
  if(): void;
};

interface fn8 {
  a?(): void;
  // a: () => void;
}

interface fn9 {
  a: () => asserts this is string;
  b: (a: any) => asserts a is string;
  c: (a: any) => a is string;
  d: (self: this, a: unknown) => a is string;
}

// type a = [string?, ...any[]];

type AA<T> = `SD-${T extends string ? T : string}`;

type ACC = string;
type bb =
  | {
      [K in 'b']: any;
    }
  | {
      [1]?: any;
      name?: any;
    }
  | {
      [K in 1 extends 1 ? '分手快乐' : '' as '1' | 2 | K]-?: any;
    }
  | {
      name: string;
      [s: ACC]: any;
    }
  | {
      (a: string, b: number, undefined: any): boolean;
      new (a: string, b: number): boolean;
      // (a: string, b: number): boolean;
      // new (a: string, b: number): boolean;
      new: () => void;
    }
  | {
      [K in ACC]: () => void;
    };

type sdfsdfsdf = `dsfsdf`['length'] extends {} ? [] : 2;
type bd = {
  [K in '1' as K['length']]: string;
};

type ACE = 1 extends infer U extends infer C extends infer CC | number
  ? [U, C, CC]
  : never;

// const a: bd = {};

// type cc = bb[]
// type b =[a: string, ...b?: any[]];
// function-generic-args
// function-args
// function-rtn
// type ads = ;
