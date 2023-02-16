import nearley from "nearley";
import langGrammar from './__lang.auto-generated__'
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
  // const content = `type ppp = | [string, true, 2, 3, 5, ""]`;
  const content = `type ppp = string`;
  // const content = ``;
  console.log(content);

  parser.feed(content);

  if (parser.results.length !== 0) {
    const results = getNonNullArgs(parser.results[0]);
    results;
  }
} catch (error) {
  console.error(error);
}
