// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var extends: any;
declare var number: any;
declare var string: any;
declare var boolean: any;
declare var newLine: any;
declare var identifier: any;
declare var ws: any;

import lexer from './moo-lexer'

const Null = () => null;

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "e_main", "symbols": ["e_literal"]},
    {"name": "e_main", "symbols": ["e_union"]},
    {"name": "e_main", "symbols": ["e_condition"]},
    {"name": "e_condition", "symbols": ["e_main", "_", (lexer.has("extends") ? {type: "extends"} : extends), "_", "e_main"]},
    {"name": "e_value", "symbols": ["e_literal"]},
    {"name": "e_value$macrocall$2", "symbols": ["e_value"]},
    {"name": "e_value$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"("}, "_", "e_value$macrocall$2", "_", {"literal":")"}]},
    {"name": "e_value$macrocall$1$ebnf$1", "symbols": ["e_value$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "e_value$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "e_value$macrocall$1", "symbols": ["e_value$macrocall$1$ebnf$1"]},
    {"name": "e_value$macrocall$1", "symbols": ["e_value$macrocall$2"]},
    {"name": "e_value", "symbols": ["e_value$macrocall$1"]},
    {"name": "e_literal", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "e_literal", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "e_literal", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)]},
    {"name": "e_union$subexpression$1$ebnf$1", "symbols": [{"literal":"|"}], "postprocess": id},
    {"name": "e_union$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "e_union$subexpression$1$ebnf$2", "symbols": []},
    {"name": "e_union$subexpression$1$ebnf$2$subexpression$1", "symbols": ["_", "e_literal", "_", {"literal":"|"}]},
    {"name": "e_union$subexpression$1$ebnf$2", "symbols": ["e_union$subexpression$1$ebnf$2", "e_union$subexpression$1$ebnf$2$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "e_union$subexpression$1", "symbols": ["e_union$subexpression$1$ebnf$1", "e_union$subexpression$1$ebnf$2"]},
    {"name": "e_union", "symbols": ["e_union$subexpression$1"]},
    {"name": "block$ebnf$1", "symbols": []},
    {"name": "block$ebnf$1", "symbols": ["block$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "block", "symbols": [{"literal":"{"}, "_", "block$ebnf$1", "_", {"literal":"}"}]},
    {"name": "lineEnd$ebnf$1", "symbols": []},
    {"name": "lineEnd$ebnf$1$subexpression$1", "symbols": [(lexer.has("newLine") ? {type: "newLine"} : newLine)]},
    {"name": "lineEnd$ebnf$1$subexpression$1", "symbols": [{"literal":";"}]},
    {"name": "lineEnd$ebnf$1", "symbols": ["lineEnd$ebnf$1", "lineEnd$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "lineEnd", "symbols": ["lineEnd$ebnf$1"], "postprocess": Null},
    {"name": "id", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": Null},
    {"name": "statement", "symbols": ["typeDefinitionStatement"]},
    {"name": "typeDefinitionStatement", "symbols": [{"literal":"type"}, "_", "id", "_", {"literal":"="}, "_", "e_main", "_", "lineEnd"]},
    {"name": "ifStatement$subexpression$1", "symbols": [{"literal":"if"}, "_", {"literal":"("}]},
    {"name": "ifStatement$subexpression$2", "symbols": [{"literal":")"}, "_"]},
    {"name": "ifStatement$subexpression$3", "symbols": ["_", {"literal":"}"}]},
    {"name": "ifStatement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["_", {"literal":"else"}, "_"]},
    {"name": "ifStatement$ebnf$1$subexpression$1", "symbols": ["ifStatement$ebnf$1$subexpression$1$subexpression$1", "elseStatement"]},
    {"name": "ifStatement$ebnf$1", "symbols": ["ifStatement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ifStatement$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "ifStatement", "symbols": ["ifStatement$subexpression$1", "condition", "ifStatement$subexpression$2", "block", "ifStatement$subexpression$3", "ifStatement$ebnf$1"]},
    {"name": "main$ebnf$1", "symbols": ["statement"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "statement"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "main", "symbols": ["main$ebnf$1"]}
  ],
  ParserStart: "main",
};

export default grammar;
