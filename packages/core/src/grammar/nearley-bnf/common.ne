@lexer lexer

blockSeparator -> _ ";":+ _  {% n %}
    | _ {% n %}

id -> %identifier {% toASTNode(ast.IdentifierExpression) %}

__ -> (%ws):+ {% n %}

_ -> __:? {% n %}