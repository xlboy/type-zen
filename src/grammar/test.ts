import nearley from "nearley";
import langGrammar from "./lang";
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

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(langGrammar));

try {
  parser.feed(grammarTemplate.typeDef.literal.string[2]);
  const results = getNonNullArgs(parser.results);
  results;
} catch (error) {
  console.error(error);
}


type sss = 1;

type sss2 = 222 | (sss extends number ? 1 : 2);

type c2 = 123 extends 121 ? 1 : 2 extends 2 ? 3 : 4 | 1 | true | "sss"