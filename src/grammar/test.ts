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
  const content = `type is = '1111;'`;
  // const content = `type aaaa = SSSwcgj<string>`;
  // console.log(content);

  parser.feed(content);

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
