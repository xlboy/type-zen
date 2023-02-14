@lexer lexer

@include "./tools.ne"

e_main -> e_union {% id %} | e_value {% id %}

e_condition -> 
    e_value _ %extend _ e_value _ "?" _ e_value _ ":" _ e_value

e_value -> (e_literal | e_condition) {% id %} # t_ParanSurround[e_value]

e_literal -> (%boolean | %string | %number) {% args => ({
    type: 'literal',
    value: args[0][0],
})    
%}

# 示例1：| 1 | 2
# 示例2: 1 | 2
e_union -> "|":? 
    _ e_value (
        _ "|" _ e_value
    ):+ 
    {% args => ({
        type: 'union',
        value: args
    }) %}
