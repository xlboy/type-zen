@lexer lexer


lineEnd -> (%newLine | ";"):* {% Null %}

id -> %identifier

_ -> %ws:* {% Null %}