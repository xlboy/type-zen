@lexer lexer

t_paranSurround[X]  -> "(" _ $X _ ")" {% args => args[2] %}

t_bracketSurround[X] -> "[" _ $X _ "]" {% args => args[2] %}
