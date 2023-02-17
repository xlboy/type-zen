@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> (s_main blockSeparator):+ {% args => args[0].map(item => item[0]) %}

s_main ->  s_typeDef {% id %}

s_typeDef -> "type" _ id _ "=" _ e_main {% toASTNode(ast.TypeDeclaration) %}

# s_if -> ("if" _ "(") condition (")" _) s_block (_ "}") ((_ "else" _) elseStatement):?