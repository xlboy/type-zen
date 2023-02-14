@lexer lexer

t_ParanSurround[X]  -> ("(" _ $X _ ")"):? | $X 