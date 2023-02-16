// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require('./moo-lexer')

const n = () => null;
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "e_main", "symbols": ["e_union"], "postprocess": id},
    {"name": "e_main", "symbols": ["e_value"], "postprocess": id},
    {"name": "e_condition", "symbols": ["e_value", "_", (lexer.has("extend") ? {type: "extend"} : extend), "_", "e_value", "_", {"literal":"?"}, "_", "e_value", "_", {"literal":":"}, "_", "e_value"]},
    {"name": "e_value", "symbols": [(lexer.has("valueKeyword") ? {type: "valueKeyword"} : valueKeyword)], "postprocess": id},
    {"name": "e_value", "symbols": ["e_literal"], "postprocess": id},
    {"name": "e_value", "symbols": ["e_condition"], "postprocess": id},
    {"name": "e_value$macrocall$2", "symbols": ["e_value"]},
    {"name": "e_value$macrocall$1", "symbols": [{"literal":"("}, "_", "e_value$macrocall$2", "_", {"literal":")"}], "postprocess": args => args[2]},
    {"name": "e_value", "symbols": ["e_value$macrocall$1"], "postprocess": id},
    {"name": "e_literal$subexpression$1", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "e_literal$subexpression$1", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "e_literal", "symbols": ["e_literal$subexpression$1"], "postprocess":  args => ({
            type: 'literal',
            value: args[0][0],
        })    
        },
    {"name": "e_union$ebnf$1$subexpression$1", "symbols": [{"literal":"|"}, "_"]},
    {"name": "e_union$ebnf$1", "symbols": ["e_union$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "e_union$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$2", "symbols": ["e_value"]},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "symbols": []},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "e_union$subexpression$1$macrocall$2$macrocall$2"]},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "symbols": ["e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$2", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "e_union$subexpression$1$macrocall$2$macrocall$1", "symbols": ["e_union$subexpression$1$macrocall$2$macrocall$2", "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$1", "e_union$subexpression$1$macrocall$2$macrocall$1$ebnf$2"], "postprocess": args => [args[0], ...args[1].map(x => x[3])]},
    {"name": "e_union$subexpression$1$macrocall$2", "symbols": ["e_union$subexpression$1$macrocall$2$macrocall$1"], "postprocess": id},
    {"name": "e_union$subexpression$1$macrocall$1", "symbols": [{"literal":"["}, "_", "e_union$subexpression$1$macrocall$2", "_", {"literal":"]"}], "postprocess": args => args[2]},
    {"name": "e_union$subexpression$1", "symbols": ["e_union$subexpression$1$macrocall$1"], "postprocess": args => args[0].map(item => item[0])},
    {"name": "e_union$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"|"}, "_", "e_value"]},
    {"name": "e_union$subexpression$1$ebnf$1", "symbols": ["e_union$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "e_union$subexpression$1$ebnf$1$subexpression$2", "symbols": ["_", {"literal":"|"}, "_", "e_value"]},
    {"name": "e_union$subexpression$1$ebnf$1", "symbols": ["e_union$subexpression$1$ebnf$1", "e_union$subexpression$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "e_union$subexpression$1", "symbols": ["e_value", "e_union$subexpression$1$ebnf$1"], "postprocess": args => [args[0], ...args[1].map(item => item[3])]},
    {"name": "e_union", "symbols": ["e_union$ebnf$1", "e_union$subexpression$1"], "postprocess":  args => ({
            type: 'union',
            value: args[1],
        }) },
    {"name": "blockSeparator$ebnf$1", "symbols": []},
    {"name": "blockSeparator$ebnf$1$subexpression$1", "symbols": [{"literal":";"}]},
    {"name": "blockSeparator$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "blockSeparator$ebnf$1", "symbols": ["blockSeparator$ebnf$1", "blockSeparator$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blockSeparator", "symbols": ["blockSeparator$ebnf$1"], "postprocess": n},
    {"name": "id", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": n},
    {"name": "s_block$ebnf$1$subexpression$1", "symbols": ["s_main", "blockSeparator"]},
    {"name": "s_block$ebnf$1", "symbols": ["s_block$ebnf$1$subexpression$1"]},
    {"name": "s_block$ebnf$1$subexpression$2", "symbols": ["s_main", "blockSeparator"]},
    {"name": "s_block$ebnf$1", "symbols": ["s_block$ebnf$1", "s_block$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "s_block", "symbols": ["s_block$ebnf$1"], "postprocess": args => args[0][0]},
    {"name": "s_main", "symbols": ["s_typeDef"], "postprocess": id},
    {"name": "s_typeDef", "symbols": [{"literal":"type"}, "_", "id", "_", {"literal":"="}, "_", "e_main"], "postprocess":  (args) => ({
            type: "typeDef",
            id: args[2],
            value: args[6]
        }) },
    {"name": "main", "symbols": [], "postprocess": d => ""},
    {"name": "main", "symbols": ["_", "s_block"], "postprocess": ([, block]) => block},
    {"name": "main", "symbols": ["_"], "postprocess": n}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
