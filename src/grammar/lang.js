// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

// import lexer from './moo-lexer'
const lexer = require('./moo-lexer')

const Null = () => null;
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "e_main", "symbols": ["e_union"]},
    {"name": "e_main", "symbols": ["e_value"]},
    {"name": "e_condition", "symbols": ["e_value", "_", (lexer.has("extend") ? {type: "extend"} : extend), "_", "e_value", "_", {"literal":"?"}, "_", "e_value", "_", {"literal":":"}, "_", "e_value"]},
    {"name": "e_value", "symbols": ["e_literal"]},
    {"name": "e_value", "symbols": ["e_condition"]},
    {"name": "e_literal", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)]},
    {"name": "e_literal", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "e_literal", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "e_union$ebnf$1", "symbols": [{"literal":"|"}], "postprocess": id},
    {"name": "e_union$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "e_union$ebnf$2$subexpression$1", "symbols": ["_", {"literal":"|"}, "_", "e_value"]},
    {"name": "e_union$ebnf$2", "symbols": ["e_union$ebnf$2$subexpression$1"]},
    {"name": "e_union$ebnf$2$subexpression$2", "symbols": ["_", {"literal":"|"}, "_", "e_value"]},
    {"name": "e_union$ebnf$2", "symbols": ["e_union$ebnf$2", "e_union$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "e_union", "symbols": ["e_union$ebnf$1", "_", "e_value", "e_union$ebnf$2"]},
    {"name": "lineEnd$ebnf$1", "symbols": []},
    {"name": "lineEnd$ebnf$1$subexpression$1", "symbols": [(lexer.has("newLine") ? {type: "newLine"} : newLine)]},
    {"name": "lineEnd$ebnf$1$subexpression$1", "symbols": [{"literal":";"}]},
    {"name": "lineEnd$ebnf$1", "symbols": ["lineEnd$ebnf$1", "lineEnd$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "lineEnd", "symbols": ["lineEnd$ebnf$1"], "postprocess": Null},
    {"name": "id", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": Null},
    {"name": "s_main", "symbols": ["s_typeDef"]},
    {"name": "s_block$ebnf$1", "symbols": []},
    {"name": "s_block$ebnf$1", "symbols": ["s_block$ebnf$1", "s_main"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "s_block", "symbols": [{"literal":"{"}, "_", "s_block$ebnf$1", "_", {"literal":"}"}]},
    {"name": "s_typeDef", "symbols": [{"literal":"type"}, "_", "id", "_", {"literal":"="}, "_", "e_main", "_", "lineEnd"]},
    {"name": "main", "symbols": ["s_main"]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
