@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_main -> s_typeDef

s_block -> "{" _ s_main:* _ "}"

s_typeDef -> "type" _ id _ "=" _ e_main _ lineEnd

# s_if -> ("if" _ "(") condition (")" _) s_block (_ "}") ((_ "else" _) elseStatement):?