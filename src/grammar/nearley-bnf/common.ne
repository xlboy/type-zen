@lexer lexer

blockSeparator -> _ ";":+ _  {% n %}
    | _ {% n %}

id -> %identifier {% toASTNode(ast.IdentifierExpression) %}

_ -> %ws:* {% n %}

nonEmptySpace -> %ws {% n %}