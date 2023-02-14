@preprocessor typescript

@{%
import lexer from './moo-lexer'

const Null = () => null;
%}

@lexer lexer
@include "./statement.ne"

main ->  statement:+

# # Obligatory whitespace
# __ -> (newline | %whitespace | %spaces | multilineComment):+ {% () => null %}

# # Optional whitespace
# _ -> __:? {% () => null %}

# # "Epsilon rule" matches nothing; an empty placeholder to align the tokens.
# # I can't use `null` directly because it gets excluded from the token array.
# empty -> null {% () => null %}