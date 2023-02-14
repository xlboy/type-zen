@lexer lexer

@include "./tools.ne"

e_main -> e_union | e_value

e_condition -> 
    e_value _ %extend _ e_value _ "?" _ e_value _ ":" _ e_value

e_value -> e_literal | e_condition # t_ParanSurround[e_value]

e_literal -> %boolean | %string | %number 

# 示例1：| 1 | 2
# 示例2: 1 | 2
e_union -> "|":? _ e_value (_ "|" _ e_value):+
