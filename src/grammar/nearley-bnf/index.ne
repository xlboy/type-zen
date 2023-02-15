@{%
const lexer = require('./moo-lexer')

const n = () => null;
%}

@lexer lexer
@include "./statement.ne"
@include "./common.ne"

main ->  null {% d => "" %}
    | _ s_block {% ([, block]) => block %}
    | _ {% n %}
