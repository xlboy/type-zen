@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> (s_main blockSeparator):+ {% args => args[0].map(item => item[0]) %}

s_main ->  s_typeDecl {% id %}

s_typeDecl -> "type" _ id _ (s_typeDecl_arguments _):? "=" _ e_main 
    {% args => toASTNode(ast.TypeDeclarationStatement)([args[0], args[2], args[4]?.[0] || void 0, args.at(-1)]) %}


# `a`, `a: b`, `a extends b`, `a = 1`, `a: b = 1`, `a extends b = 1`
s_typeDecl_arguments -> "<" _ id s_typeDecl_arguments_group
    (_ "," _ id s_typeDecl_arguments_group):* _ ">" 
    {% args => {
        const firstArg = Object.assign({ id: args[2], type: void 0, default: void 0 }, args[3] || {});
        const restArgs = args[4].map(arg => {
           return  Object.assign({ id: arg[3], type: void 0, default: void 0 }, arg[4] || {}) 
        });
        return toASTNode(ast.TypeDeclarationArgsExpression)([args[0], [firstArg, ...restArgs], args.at(-1)]);
    } %}

s_typeDecl_arguments_group -> 
    ((_ ":" _ e_main) | (nonEmptySpace "extends" nonEmptySpace e_main)):? (_ "=" _ e_main):?
    {% args => {
        const type = args[0]?.[0]?.at(-1);
        const _default = args[1]?.at(-1);
        return (type || _default) ? { type, default: _default } : null
    }%}

# s_if -> ("if" _ "(") condition (")" _) s_block (_ "}") ((_ "else" _) elseStatement):?