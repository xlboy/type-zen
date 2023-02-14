@lexer lexer

@include "./tools.ne"

e_main -> e_literal | e_union | e_condition

e_condition -> 
    e_main _ %extends _ e_main

e_value ->  e_literal | t_ParanSurround[e_value]

e_literal -> %number | %string | %boolean

e_union -> ("|":? ( _ e_literal _ "|"):*)
