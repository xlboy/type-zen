@lexer lexer


@include "./tools.ne"

e_main -> e_mainWithoutUnion {% id %}
    | e_union {% id %}

# 之所以要将 “除 union 的表达式” 抽取出来，是为了让 **union 表达式内部的递归** 避免递归了其本身，这会导致极大程度的性能损耗、溢出…  
e_mainWithoutUnion -> 
    e_object {% id %}
    | e_tuple {% id %}
    | e_value {% id %}
    | e_function {% id %}
    | e_typeReference {% id %}
    | e_condition {% id %}
    | e_array {% id %}
    | e_getKeyValue {% id %}
    | e_conditionInfer {% id %}
    | e_bracketSurround {% id %}
    | e_intersection {% id %}
    | e_keyof {% id %}
    | e_sugarBlock {% id %}
    | e_templateString {% id %}


#region  //*=========== function ===========
e_function_constructor[fn] -> "new" nonEmptySpace:+ $fn
    {% args => toASTNode(ast.Function.Mode.ConstructorExpression)([args[0], args.at(-1)]) %}

e_function -> e_function_constructor[e_function_arrow {% id %}] {% id %}
    | e_function_arrow {% id %}

e_function_normal -> e_function_body _ ":"  _ e_function_return
    {% args => toASTNode(ast.Function.Mode.NormalExpression)([args[0], args.at(-1)]) %}
    | e_function_genericArgs _ e_function_body _ ":"  _ e_function_return
        {% args => toASTNode(ast.Function.Mode.NormalExpression)([args[0], args[2], args.at(-1)]) %}
    | e_function_genericArgs _ e_function_body 
        {% args => toASTNode(ast.Function.Mode.NormalExpression)([args[0], args.at(-1)]) %}
    | e_function_body 
        {% toASTNode(ast.Function.Mode.NormalExpression) %}


e_function_arrow -> e_function_body _ "=>"  _ e_function_return
    {% args => toASTNode(ast.Function.Mode.ArrowExpression)([args[0], args.at(-1)]) %}
    | e_function_genericArgs _ e_function_body _ "=>"  _ e_function_return
        {% args => toASTNode(ast.Function.Mode.ArrowExpression)([args[0], args[2], args.at(-1)]) %}

e_function_genericArgs -> e_genericArgs {% id %}

e_function_body -> "(" _ ("...":? id _ "?":? _ ":" _ e_main):? _ (_ "," _ "...":? id _ "?":? _ ":" _ e_main):* ",":? _  ")"
    {% args => {
        const bodyArgs = [];
        if (args[2]) { bodyArgs.push({ id: args[2][1], type: args[2].at(-1), rest: !!args[2][0], optional: !!args[2][3] }) }
        const restArgs = args[4].map(arg => ({ id: arg[4], type: arg.at(-1), rest: !!arg[3], optional: !!arg[6] }));
        bodyArgs.push(...restArgs);
        return toASTNode(ast.Function.Body.Expression)([args[0], bodyArgs, args.at(-1)]);
    } %}


#region  //*=========== function-return ===========
e_function_return ->  
    e_function_return_assertsAndIs {% id %}
    | e_function_return_isOnly {% id %}
    | e_function_return_normal {% id %}
    
e_function_return_assertsSource -> "this" {% id %} | id {% id %}

e_function_return_assertsAndIs -> 
    "asserts" nonEmptySpace:+ e_function_return_assertsSource nonEmptySpace:+ "is" nonEmptySpace:+ e_main
    {% args => toASTNode(ast.Function.Return.Expression)([args[0], args[2], args.at(-1)]) %}

e_function_return_isOnly -> e_function_return_assertsSource nonEmptySpace:+ "is" nonEmptySpace:+ e_main
    {% args => toASTNode(ast.Function.Return.Expression)([args[0], args.at(-1)]) %}

e_function_return_normal -> e_main {% toASTNode(ast.Function.Return.Expression) %}
#endregion  //*======== function-return ===========

#endregion  //*======== function ===========


#region  //*=========== sugar block ===========
e_sugarBlock -> "^" _ e_sugarBlock_content {% args => args.at(-1) %}

e_sugarBlock_content -> "{" _ (e_sugarBlock_content_block blockSeparator):+ "}" 
    {% args => toASTNode(ast.SugarBlockExpression)([args[0], args[2].map(id), args.at(-1)]) %}
    
e_sugarBlock_content_block -> s_typeAlias {% id %}
    | e_sugarBlock_if {% id %}
    | e_sugarBlock_return {% id %}
    | e_sugarBlock_for {% id %}


#region  //*=========== if ===========
e_sugarBlock_if -> "if" _ "(" e_sugarBlock_if_condition ")" _ e_sugarBlock_content
    {% args => toASTNode(ast.SugarBlockIfExpression)([args[0], args[3], args.at(-1)]) %}
    | "if" _ "(" e_sugarBlock_if_condition ")" _ e_sugarBlock_content _ "else" _ e_sugarBlock_content
    {% args => toASTNode(ast.SugarBlockIfExpression)([args[0], args[3], args[6], args.at(-1)]) %}
    | "if" _ "(" e_sugarBlock_if_condition ")" _ e_sugarBlock_content _ "else" nonEmptySpace:+ e_sugarBlock_if
    {% args => toASTNode(ast.SugarBlockIfExpression)([args[0], args[3], args[6], args.at(-1)]) %}


e_sugarBlock_if_condition -> e_main e_condition_extend e_main {% args => ({ left: args[0], right: args.at(-1) }) %}
#endregion  //*======== if ===========

#region  //*=========== for ===========
e_sugarBlock_for -> "for" _ "(" e_sugarBlock_for_mapping _ ")" _ e_sugarBlock_content
    {% args => toASTNode(ast.SugarBlockForExpression)([args[0], args[3], args.at(-1)]) %}
e_sugarBlock_for_mapping -> "infer" nonEmptySpace:+ id nonEmptySpace:+ "in" nonEmptySpace:+ e_main
    {% args => ({ name: args[2], source: args.at(-1) }) %}
#endregion  //*======== for ===========

e_sugarBlock_return -> "return" nonEmptySpace:+ e_main 
    {% args => toASTNode(ast.SugarBlockReturnExpression)([args[0], args.at(-1)]) %}
#endregion  //*======== sugar block ===========
    
#region  //*=========== object ===========
e_object -> 
    "{" _ "}" {% args => toASTNode(ast.Object.Expression)([args[0], [], args.at(-1)]) %}
    | "{" _ (e_object_content _ e_object_content_eof):+ "}"
        {% args => toASTNode(ast.Object.Expression)([args[0], args[2].map(id), args.at(-1)]) %}
    
e_object_content_eof -> (("," | ";") _) | null

e_object_content -> 
    e_object_content_call {% id %}
    | e_object_content_constructor {% id %}
    | e_object_content_method {% id %}
    | e_object_content_normal {% id %}
    | e_object_content_literalIndex {% id %}
    | e_object_content_indexSignature {% id %}
    | e_object_content_mapped {% id %}

e_object_content_call -> e_function_normal {% id %}
e_object_content_constructor -> e_function_constructor[e_function_normal {% id %}] {% id %}

e_object_content_key -> id {% id %}
    | ("if" | "else" | "in" | "void" | "this" | "function") {% args => toASTNode(ast.IdentifierExpression)([args[0][0]]) %}

e_object_content_method -> e_object_content_method_key _ "?":? _ e_function_normal 
    {% args => toASTNode(ast.Object.Content.MethodExpression)([
        args[0], 
        !!args[2], args.at(-1)
        ]) 
    %}   
e_object_content_method_key -> e_object_content_key {% id %}

e_object_content_normal  -> e_object_content_normal_key _ "?":? _ ":" _ e_main
    {% args => toASTNode(ast.Object.Content.NormalExpression)([args[0], !!args[2], args.at(-1)]) %}
e_object_content_normal_key -> e_object_content_key {% id %}
    | "new" {% toASTNode(ast.IdentifierExpression) %}

    
e_object_content_literalIndex -> "[" _ (e_string | e_number) _ "]" _ "?":? _ ":" _ e_main
    {% args => toASTNode(ast.Object.Content.LiteralIndexExpression)([args[0], args[2][0], !!args[6], args.at(-1)]) %}
    
e_object_content_indexSignature -> "[" _ id _ ":" _ e_main _ "]" _ ":" _ e_main
    {% args => toASTNode(ast.Object.Content.IndexSignatureExpression)([args[0], args[2], args[6], args.at(-1)]) %}

e_object_content_mapped -> 
    "[" _ 
        (
            id nonEmptySpace:+ "in" nonEmptySpace:+ e_main 
            (nonEmptySpace:+ "as" nonEmptySpace:+ e_main):?
        )
    _ "]"
    _ (("-" _ "?") | "?"):? _ ":" _
    e_main
    {% args => {
        const hasAsTarget = !!args[2]?.[5];
        const asTarget = hasAsTarget ? args[2][5].at(-1) : false;
        const operator = !!args[6] ? Array.isArray(args[6][0]) ? [true, true] : [false, true] : [false, false];
        return toASTNode(ast.Object.Content.MappedExpression)([args[0], args[2][0], args[2][4], asTarget, operator, args.at(-1)])
    } %}


#endregion  //*======== object ===========

#region  //*=========== genericArgs ===========
# `a`, `a: b`, `a extends b`, `a = 1`, `a: b = 1`, `a extends b = 1`
e_genericArgs -> "<" _ id e_genericArgs_group
    (_ "," _ id e_genericArgs_group):* ",":? _ ">" 
    {% args => {
        const firstArg = Object.assign({ id: args[2], type: void 0, default: void 0 }, args[3] || {});
        const restArgs = args[4].map(arg => {
           return  Object.assign({ id: arg[3], type: void 0, default: void 0 }, arg[4] || {}) 
        });
        return toASTNode(ast.GenericArgsExpression)([args[0], [firstArg, ...restArgs], args.at(-1)]);
    } %}

e_genericArgs_group -> 
    ((_ ":" _ e_main) | (nonEmptySpace "extends" nonEmptySpace e_main)):? (_ "=" _ e_main):?
    {% args => {
        const type = args[0]?.[0]?.at(-1);
        const _default = args[1]?.at(-1);
        return (type || _default) ? { type, default: _default } : null
    }%}

#endregion  //*======== genericArgs ===========

e_getKeyValue -> e_main _ "[" _ e_main _ "]" {% (...args) => filterAndToASTNode(args, ast.GetKeyValueExpression) %}

#region  //*=========== tuple ===========
e_tuple -> 
    "[" _ "]" {% args => toASTNode(ast.TupleExpression)([args[0], [], args.at(-1)]) %}
    | "[" _ e_tuple_value _ ",":? _ "]" 
        {% args => toASTNode(ast.TupleExpression)([args[0], [args[2]], args.at(-1)]) %}
    | "[" _ e_tuple_value (_ "," _ e_tuple_value):* (_ ","):? _ "]" 
        {% args => toASTNode(ast.TupleExpression)(
            [args[0], [args[2], ...args[3].map(item => item.at(-1))], args.at(-1)]
        ) %}

e_tuple_value -> 
    e_main _ "?" {% args => ({ id: false, deconstruction: false, type: args[0], optional: true }) %}
    | e_main {% args => ({ id: false, deconstruction: false, type: args[0], optional: false }) %}
    | "..." e_main {% args => ({ id: false, deconstruction: true, type: args[1], optional: false }) %}
    | id _ "?":? _ ":" _ e_main {% args => ({ id: args[0], deconstruction: false, type: args.at(-1), optional: !!args[2] }) %}
    | "..." id _ ":" _ e_main {% args => ({ id: args[1], deconstruction: true, type: args.at(-1), optional: false }) %}
#endregion  //*======== tuple ===========

e_array -> e_main "[" "]" {% (...args) => filterAndToASTNode(args, ast.ArrayExpression) %}

e_typeReference -> id _ ("<" 
        (_ e_main (_ "," _ e_main):* {% args => [args[1], ...args[2].map(item => item[3])] %}) 
     _ ">"):?  {% args => toASTNode(ast.TypeReferenceExpression)([args[0], ...(args[2] || [])]) %}

e_bracketSurround -> "(" _ e_main _ ")" {% toASTNode(ast.BracketSurroundExpression) %}

#region  //*=========== condition ===========
e_condition -> 
    e_main e_condition_extend e_main _ "?" _ e_main _ ":" _ e_main 
    {% (...args) => filterAndToASTNode(args, ast.ConditionExpression) %}

e_conditionInfer -> "infer" nonEmptySpace id (e_condition_extend e_main):* 
    {% args => {
        if (args[3].length === 0) {
            return toASTNode(ast.InferExpression)([args[0], args[2]]);
        }
        return toASTNode(ast.InferExpression)([args[0], args[2], args[3].map(item => item.at(-1))])
    } %}

e_condition_extend -> (nonEmptySpace:+ "extends" nonEmptySpace:+) | (_ "==" _)
#endregion  //*======== condition ===========

e_keyof -> "keyof" nonEmptySpace:+ e_main
    {% (args, d, reject) => {
        const _args = [args[0], args.at(-1)];
        return filterAndToASTNode([_args, d, reject], ast.KeyofExpression)
    } %}

e_value -> %literalKeyword {% toASTNode(ast.LiteralKeywordExpression) %} 
    | e_string {% id %}
    | e_number {% id %}

e_string -> %string {% toASTNode(ast.StringLiteralExpression) %}
e_number -> %number {% toASTNode(ast.NumberLiteralExpression) %}

e_templateString -> "`" "`" {% args => toASTNode(ast.TemplateStringExpression)([args[0], [], args.at(-1)]) %}
    | "`" [^`]:+ "`"
      {% args => {
        return toASTNode(ast.TemplateStringExpression)([args[0], filterTemplateStringContent(args[1]), args.at(-1)])
      } %}

#region  //*=========== union ===========

# `[]`、`[1]`、`[1,]`、`[1,2]`、`[1,2,]` 内部的元素
e_union_commaSeparation[X] -> 
    $X (_ "," _ $X):* ",":? {% args => [args[0], ...args[1].map(x => x[3])] %}

# `| [1, 2, 3]` 的 union 姿态
e_union_mode1 -> "|" _ "[" _ 
    e_union_commaSeparation[(e_mainWithoutUnion | e_union_mode2) {% id %}]
    _ "]" 
    {% args => toASTNode(ast.UnionExpression)([args[0], args[2], args[4].map(item => item[0]), args.at(-1)]) %}

# `| 1 | 2`、`1 | 2 | 3` 的 union 姿态
# TODO：为什么 `("|":? _)` 会出现「解析了2次」的情况？
# TODO：而 `("|" _):?` 则不会？
e_union_mode2 -> ("|" _):? e_mainWithoutUnion (_ "|" _ e_mainWithoutUnion):+ 
    {% (args, d, reject) => {
        const _args = [[args[1], ...args[2].map(item => item[3])]];
        return filterAndToASTNode([_args, d, reject], ast.UnionExpression)
    } %}

e_union -> e_union_mode1 {% id %}
    | e_union_mode2 {% id %}
#endregion  //*======== union ===========

#region  //*=========== intersection ===========
# `[]`、`[1]`、`[1,]`、`[1,2]`、`[1,2,]` 内部的元素
e_intersection_commaSeparation[X] -> 
    $X (_ "," _ $X):* ",":? {% args => [args[0], ...args[1].map(x => x[3])] %}

# `& [1, 2, 3]` 的 intersection 姿态
e_intersection_mode1 -> "&" _ "[" _ e_intersection_commaSeparation[e_main] _ "]" 
    {% args => toASTNode(ast.IntersectionExpression)([args[0], args[4].map(id), args.at(-1)]) %}

# `1 & 2`、`1 & 2 & 3` 的 intersection 姿态
e_intersection_mode2 -> e_main (_ "&" _ e_main):+ 
    {% (args, d, reject) => {
        const _args = [[args[0], ...args[1].map(item => item.at(-1))]];
        return filterAndToASTNode([_args, d, reject], ast.IntersectionExpression)
    } %}

e_intersection -> e_intersection_mode1 {% id %}
    | e_intersection_mode2 {% id %}
#endregion  //*======== intersection ===========
