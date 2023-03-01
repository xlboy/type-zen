@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> (s_main blockSeparator):+ {% args => args[0].map(item => item[0]) %}

s_main ->  s_typeAlias {% id %}
    | s_declareVariable {% id %}
    | s_declareFunction {% id %}

s_typeAlias -> "type" _ id _ (e_genericArgs _):? "=" _ e_main 
    {% args => toASTNode(ast.TypeAliasStatement)([args[0], args[2], args[4]?.[0] || void 0, args.at(-1)]) %}
    
#region  //*=========== declare variable ===========
s_declareVariable -> "declare" nonEmptySpace:+ s_declareVariable_type nonEmptySpace:+ id 
    {% args => toASTNode(ast.DeclareVariableStatement)([args[0], args[2], args.at(-1)]) %}
    | "declare" nonEmptySpace:+ s_declareVariable_type nonEmptySpace:+ id _ ":" _ e_main
        {% args => toASTNode(ast.DeclareVariableStatement)([args[0], args[2], args[4], args.at(-1)]) %}

s_declareVariable_type -> ("const" | "let" | "var") {% args => args[0][0].value%}
#endregion  //*======== declare variable ===========

s_declareFunction -> "declare" nonEmptySpace:+ "function" nonEmptySpace:+ id
    {% args => toASTNode(ast.DeclareFunctionStatement)([args[0], args.at(-1)])%}
    | "declare" nonEmptySpace:+ "function" nonEmptySpace:+ id _ e_function_normal
        {% args => toASTNode(ast.DeclareFunctionStatement)([args[0], args[4], args.at(-1)])%}


# s_if -> ("if" _ "(") condition (")" _) s_block (_ "}") ((_ "else" _) elseStatement):?