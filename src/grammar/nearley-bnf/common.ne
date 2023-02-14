@lexer lexer


block -> "{" _ statement:* _ "}"

lineEnd -> (%newLine | ";"):* {% Null %}

id -> %identifier

_ -> %ws:* {% Null %}