@lexer lexer

@include "./expression.ne"
@include "./common.ne"

statement -> typeDefinitionStatement

typeDefinitionStatement -> "type" _ id _ "=" _ e_main _ lineEnd

ifStatement -> ("if" _ "(") condition (")" _) block (_ "}") ((_ "else" _) elseStatement):?