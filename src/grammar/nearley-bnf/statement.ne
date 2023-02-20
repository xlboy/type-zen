@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> (s_main blockSeparator):+ {% args => args[0].map(item => item[0]) %}

s_main ->  s_typeDecl {% id %}

s_typeDecl -> "type" _ id _ (s_typeDecl_arguments _):? "=" _ e_main 
    {% args => toASTNode(ast.TypeDeclarationStatement)([args[0], args[2], args[4]?.[0] || undefined, args.at(-1)]) %}


# `a`, `a: b`, `a extends b`, `a = 1`, `a: b = 1`, `a extends b = 1`
s_typeDecl_arguments -> "<" _ id _ ((":" | "extends") _ e_main):? (_ "=" _ e_main):? 
    (_ "," _ id _ ((":" | "extends") _ e_main):? (_ "=" _ e_main):?):* _ ">" 
    {% args => {
        const firstArg = { id: args[2], type: args[4]?.at(-1), default: args[5]?.at(-1) };
        const restArgs = args[6].map(arg => {
            return { id: arg[3], type: arg[5]?.at(-1), default: arg[6]?.at(-1) };
        });
        return toASTNode(ast.TypeDeclarationArgsExpression)([args[0], [firstArg, ...restArgs], args.at(-1)])
    } %}


# s_if -> ("if" _ "(") condition (")" _) s_block (_ "}") ((_ "else" _) elseStatement):?