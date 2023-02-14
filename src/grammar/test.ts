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

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(langGrammar as any));

try {
  console.log(grammarTemplate.typeDef.union[0]);


  parser.feed(grammarTemplate.typeDef.union[0]);
  const results = getNonNullArgs(parser.results);
  results;
} catch (error) {
  console.error(error);
}

type sss = 1;

type sss2 = 222 | (sss extends number ? 1 : 2);

type c2 = 123 extends 121 ? 1 : 2 extends 2 ? 3 : 4 | 1 | true | "sss";

type newFnType = new (a: number, b: string) => number;

interface PolymorphicType {
  (a: number): void;
  new (a: number, b: number): void;

  name: string;
  getName(): string;
};


const polymorphicData: PolymorphicType = {} as any

polymorphicData.getName();
polymorphicData.name;
new polymorphicData(1,2);
polymorphicData(1);

