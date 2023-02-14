@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> (s_main blockSeparator):*

s_main ->  s_typeDef {% id %}

s_typeDef -> "type" _ id _ "=" _ e_main {% (args) => ({
    type: "typeDef",
    name: args[2],
    value: args[6][0]
}) %}

# s_if -> ("if" _ "(") condition (")" _) s_block (_ "}") ((_ "else" _) elseStatement):?