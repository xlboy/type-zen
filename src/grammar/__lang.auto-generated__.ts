// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var extend: any;
declare var valueKeyword: any;
declare var string: any;
declare var number: any;
declare var ws: any;
declare var identifier: any;

import lexer  from './moo-lexer'
import * as ast from '../ast'
import { toASTNode } from './utils'

const n = () => null;

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
    {"name": "e_main", "symbols": ["e_bracketSurround"], "postprocess": id},
    {"name": "e_main", "symbols": ["e_union"], "postprocess": id},
    {"name": "e_main", "symbols": ["e_value"], "postprocess": id},
    {"name": "e_main", "symbols": ["e_typeReference"], "postprocess": id},
    {"name": "e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "e_main"]},
    {"name": "e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": ["e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "e_typeReference$ebnf$1$subexpression$1$subexpression$1", "symbols": ["_", "e_main", "e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1"], "postprocess": args => [args[1], ...args[2].map(item => item[3])]},
    {"name": "e_typeReference$ebnf$1$subexpression$1", "symbols": [{"literal":"<"}, "e_typeReference$ebnf$1$subexpression$1$subexpression$1", "_", {"literal":">"}]},
    {"name": "e_typeReference$ebnf$1", "symbols": ["e_typeReference$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "e_typeReference$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "e_typeReference", "symbols": ["id", "_", "e_typeReference$ebnf$1"], "postprocess": args => toASTNode(ast.TypeReferenceExpression)([args[0], ...(args[2] || [])])},
    {"name": "e_bracketSurround", "symbols": [{"literal":"("}, "_", "e_main", "_", {"literal":")"}], "postprocess": toASTNode(ast.BracketSurroundExpression)},
    {"name": "e_condition", "symbols": ["e_main", "_", (lexer.has("extend") ? {type: "extend"} : extend), "_", "e_main", "_", {"literal":"?"}, "_", "e_main", "_", {"literal":":"}, "_", "e_main"]},
    {"name": "e_value", "symbols": [(lexer.has("valueKeyword") ? {type: "valueKeyword"} : valueKeyword)], "postprocess": toASTNode(ast.ValueKeywordExpression)},
    {"name": "e_value", "symbols": ["e_literal"], "postprocess": id},
    {"name": "e_value", "symbols": ["e_condition"], "postprocess": id},
    {"name": "e_literal", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": toASTNode(ast.StringLiteralExpression)},
    {"name": "e_literal", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": toASTNode(ast.NumberLiteralExpression)},
    {"name": "e_union$ebnf$1$subexpression$1", "symbols": [{"literal":"|"}, "_"]},
    {"name": "e_union$ebnf$1", "symbols": ["e_union$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "e_union$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$2", "symbols": ["e_main"]},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "symbols": []},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "e_union$subexpression$1$macrocall$2$macrocall$2"]},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "symbols": ["e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$2", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1", "symbols": ["e_union$subexpression$1$macrocall$2$macrocall$2", "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$2"], "postprocess": args => [args[0], ...args[1].map(x => x[3])]},
    {"name": "e_union$subexpression$1$macrocall$2", "symbols": ["e_union$subexpression$1$macrocall$2$macrocall$1"], "postprocess": id},
    {"name": "e_union$subexpression$1$macrocall$1", "symbols": [{"literal":"["}, "_", "e_union$subexpression$1$macrocall$2", "_", {"literal":"]"}], "postprocess": args => args[2]},
    {"name": "e_union$subexpression$1", "symbols": ["e_union$subexpression$1$macrocall$1"], "postprocess": args => args[0].map(item => item[0])},
    {"name": "e_union$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"|"}, "_", "e_main"]},
    {"name": "e_union$subexpression$1$ebnf$1", "symbols": ["e_union$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "e_union$subexpression$1$ebnf$1$subexpression$2", "symbols": ["_", {"literal":"|"}, "_", "e_main"]},
    {"name": "e_union$subexpression$1$ebnf$1", "symbols": ["e_union$subexpression$1$ebnf$1", "e_union$subexpression$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "e_union$subexpression$1", "symbols": ["e_main", "e_union$subexpression$1$ebnf$1"], "postprocess": args => [args[0], ...args[1].map(item => item[3])]},
    {"name": "e_union", "symbols": ["e_union$ebnf$1", "e_union$subexpression$1"], "postprocess": args => toASTNode(ast.UnionExpression)(args[1])},
    {"name": "blockSeparator$ebnf$1", "symbols": []},
    {"name": "blockSeparator$ebnf$1$subexpression$1", "symbols": [{"literal":";"}]},
    {"name": "blockSeparator$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "blockSeparator$ebnf$1", "symbols": ["blockSeparator$ebnf$1", "blockSeparator$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "blockSeparator", "symbols": ["blockSeparator$ebnf$1"], "postprocess": n},
    {"name": "id", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": toASTNode(ast.IdentifierExpression)},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": n},
    {"name": "s_block$ebnf$1$subexpression$1", "symbols": ["s_main", "blockSeparator"]},
    {"name": "s_block$ebnf$1", "symbols": ["s_block$ebnf$1$subexpression$1"]},
    {"name": "s_block$ebnf$1$subexpression$2", "symbols": ["s_main", "blockSeparator"]},
    {"name": "s_block$ebnf$1", "symbols": ["s_block$ebnf$1", "s_block$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "s_block", "symbols": ["s_block$ebnf$1"], "postprocess": args => args[0].map(item => item[0])},
    {"name": "s_main", "symbols": ["s_typeDef"], "postprocess": id},
    {"name": "s_typeDef", "symbols": [{"literal":"type"}, "_", "id", "_", {"literal":"="}, "_", "e_main"], "postprocess": toASTNode(ast.TypeDeclarationStatement)},
    {"name": "main", "symbols": [], "postprocess": n},
    {"name": "main", "symbols": ["_", "s_block"], "postprocess": ([, block]) => block},
    {"name": "main", "symbols": ["_"], "postprocess": n}
  ],
  ParserStart: "main",
};

export default grammar;
