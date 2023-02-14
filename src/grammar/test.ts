import nearley from "nearley";
const langGrammar = require("./lang.js");
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
  const content = `type name  = "123123dsfsdf";
  type age = 111;
  `
  console.log(content);

  parser.feed(content);

  if (parser.results.length !== 0) {
    const results = getNonNullArgs(parser.results[0]);
    results;
  }
} catch (error) {
  console.error(error);
}
