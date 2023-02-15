import nearley from "nearley";
const langGrammar = require("./__lang.auto-generated__.js");
import { grammarTemplate } from "./template";

type NearleyArgs = (moo.Token | NearleyArgs | null)[];

function getNonNullArgs(args: NearleyArgs): moo.Token[] {
  const nonNullArgs: moo.Token[] = [];
  for (const arg of args) {
    if (arg) {
      if (Array.isArray(arg)) {
        nonNullArgs.push(...getNonNullArgs(arg));
      } else {
        nonNullArgs.push(arg);
      }
    }
  }
  return nonNullArgs;
}

const parser = new nearley.Parser(
  nearley.Grammar.fromCompiled(langGrammar as any)
);

try {
  // const content = `type ppp = false | "11" | 'dfdf'`;
  const content = `type ppp = | [true, 2, 3, 5, ""]`;
  // const content = `type ppp = 1`;
  console.log(content);

  parser.feed(content);

  if (parser.results.length !== 0) {
    const results = getNonNullArgs(parser.results[0]);
    results;
  }
} catch (error) {
  console.error(error);
}
