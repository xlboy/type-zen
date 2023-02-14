@lexer lexer

blockSeparator -> (";" | %ws):*  {% n %}

id -> %identifier {% id %}

_ -> %ws:* {% n %}