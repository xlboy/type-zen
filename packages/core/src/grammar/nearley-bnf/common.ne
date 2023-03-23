@lexer lexer

blockSeparator -> ";":+ {% n %}
    | ";":+ __ {% n %}
    | __ {% n %}
    | __ ";":+ {% n %}
    | __ ";":+ __ {% n %}
    

id -> %identifier {% toASTNode(ast.IdentifierExpression) %}

__ -> (%ws | comment_line | comment_multiline):+ {% n %}

_ -> __:? {% n %}

comment_line -> %lineComment {% n %}
comment_multiline -> "/*" comment_multiline_body:* "*/"  {% n %}
comment_multiline_body -> %multilineCommentString {% n %}
	| comment_multiline {% () => null %}