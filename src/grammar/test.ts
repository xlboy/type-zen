import nearley from "nearley";
import langGrammar from "./__lang.auto-generated__";
import { grammarTemplate } from "./template";

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(langGrammar));

try {
  // const content = `type ppp = false | "11" | 'dfdf'`;
  // const content = `type ppp = | [string, true, 2, 3, 5, ""]`;
  // const content = `type ppp =        string
  // ;;;;;;;type ppp_2 =    "nnnnn"
  // type u2 = 11 | "fa" | true;
  // type u = | [1, true, "str", boolean, never];
  // `;
  const content = `type is = <T>(t: T) => asserts t is void`;
  // const content = `type aaaa = SSSwcgj<string>`;
  // console.log(content);

  console.time("parser feed")
  parser.feed(content);
  console.timeEnd("parser feed")


  if (parser.results.length !== 0) {
    for (const result of parser.results[0]) {
      console.log(`结果： ${result.compile()}`);
    }
  }
} catch (error: any) {
  const lineColRegex =
    /^(?:invalid syntax|Syntax error) at line (\d+) col (\d+):\n\n {2}[^\n]+\n {2,}\^/;
  const basedOnRegex = /A ("(?:[^"]|\\")+"|.+ token) based on:/g;

  const nearleyMsg = error.message.replace(lineColRegex, "");
  console.error(error);
}

type i = 1;

declare const fn1: (a: string, b: number) => boolean;
declare function fn2(a: string, b: number): boolean;
type fn3 = (a: string, b: number) => boolean;
type fn4 = new (a: string, b: number) => boolean;
type fn5 = {
  (a: string, b: number): boolean;
  new (a: string, b: number): boolean;
  a: new (a: string, b: number) => boolean;
};
type fn6 = {
  a(): void;
};
type fn7 = {
  a: () => void;
};

interface fn8 {
  a(): void;
  a: () => void;
}

interface fn9 {
  a: () => asserts this is string;
  b: (a: any) => asserts a is string;
  c: (a: any) => a is string;
  d: (self: this, a: unknown,) => a is string;
}
// function-generic-args
// function-args
// function-rtn

