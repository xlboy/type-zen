@lexer lexer

blockSeparator -> (";" | %ws):*  {% n %}

id -> %identifier {% toASTNode(ast.IdentifierExpression) %}

_ -> %ws:* {% n %}

nonEmptySpace -> %ws {% n %}