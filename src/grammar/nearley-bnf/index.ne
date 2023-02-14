# @preprocessor typescript

@{%
// import lexer from './moo-lexer'
const lexer = require('./moo-lexer')

const n = () => null;
%}

@lexer lexer
@include "./statement.ne"
@include "./common.ne"

main ->  _ s_block {% ([, block]) => block %}
    | _ {% n %}

# # Obligatory whitespace
# __ -> (newline | %whitespace | %spaces | multilineComment):+ {% () => null %}

# # Optional whitespace
# _ -> __:? {% () => null %}

# # "Epsilon rule" matches nothing; an empty placeholder to align the tokens.
# # I can't use `null` directly because it gets excluded from the token array.
# empty -> null {% () => null %}