@lexer lexer

@include "./tools.ne"

e_main -> e_union {% id %}
    | e_value {% id %}
    | e_typeReference {% id %}
    
e_typeReference -> id _ ("<" 
        (_ e_main (_ "," _ e_main):* {% args => [args[1], ...args[2].map(item => item[3])] %}) 
     _ ">"):?  {% args => toASTNode(ast.TypeReferenceExpression)([args[0], ...(args[2] || [])]) %}

e_condition -> 
    e_value _ %extend _ e_value _ "?" _ e_value _ ":" _ e_value

e_value -> %valueKeyword {% toASTNode(ast.ValueKeywordExpression) %} 
    | e_literal {% id %} 
    | e_condition {% id %} 
    | t_paranSurround[e_value] {% id %} 

e_literal -> %string {% toASTNode(ast.StringLiteralExpression) %}
    | %number {% toASTNode(ast.NumberLiteralExpression) %}

# `[]`、`[1]`、`[1,]`、`[1,2]`、`[1,2,]` 内部的元素
e_union_commaSeparation[X] -> 
    $X (_ "," _ $X):* ",":? {% args => [args[0], ...args[1].map(x => x[3])] %}

# 示例：`| 1 | 2`、`1 | true`、`| [1, true]`
# TODO：为什么 `("|":? _)` 会出现「解析了2次」的情况？
# TODO：而 `("|" _):?` 则不会？
e_union -> ("|" _):?
    (
        t_bracketSurround[
            e_union_commaSeparation[e_main] {% id %}
        ] {% args => args[0].map(item => item[0]) %}

        | e_main (_ "|" _ e_main):+ {% args => [args[0], ...args[1].map(item => item[3])] %}
    )
    {% args => toASTNode(ast.UnionExpression)(args[1]) %}


