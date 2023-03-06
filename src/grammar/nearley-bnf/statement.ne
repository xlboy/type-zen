@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> (s_main blockSeparator):+ {% args => args[0].map(id) %}

s_main ->  s_typeAlias {% id %}
    | s_declareVariable {% id %}
    | s_declareFunction {% id %}
    | s_enum {% id %}

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

#region  //*=========== enum ===========
s_enum -> "enum" nonEmptySpace:+ id _ "{" _ "}" 
    {% args => toASTNode(ast.EnumStatement)([args[0], args[2], [], args.at(-1)]) %}

    | "const" nonEmptySpace:+ "enum" nonEmptySpace:+ id _ "{" _ "}" 
        {% args => toASTNode(ast.EnumStatement)([args[0], args[4], [], args.at(-1)]) %}

    | "enum" nonEmptySpace:+ id _ "{" _ (s_enum_member _ s_enum_member_eof):+ "}" 
        {% args => toASTNode(ast.EnumStatement)([args[0], args[2], args[6].map(id), args.at(-1)]) %}

    | "const" nonEmptySpace:+ "enum" nonEmptySpace:+ id _ "{" _ (s_enum_member _ s_enum_member_eof):+ "}" 
        {% args => toASTNode(ast.EnumStatement)([args[0], args[4], args[8].map(id), args.at(-1)]) %}
    
s_enum_member -> id _ "=" _ (e_number | e_string) 
    {% args => toASTNode(ast.EnumMemberExpression)([args[0], args.at(-1)[0]]) %}
    | id _ {% args => toASTNode(ast.EnumMemberExpression)([args[0]]) %}

s_enum_member_eof -> ("," | ";") _ {% n %}
#endregion  //*======== enum ===========

#region  //*=========== sugar block ===========
s_sugarBlock -> "^" _ s_sugarBlock_content {% args => args.at(-1) %}

s_sugarBlock_content -> "{" _ (s_sugarBlock_content_block blockSeparator):+ "}" 
    {% args => toASTNode(ast.SugarBlockStatement)([args[0], args[2].map(id), args.at(-1)]) %}
    
s_sugarBlock_content_block -> s_typeAlias {% id %}
    | s_if {% id %}
    | s_return {% id %}
#endregion  //*======== sugar block ===========
    
#region  //*=========== if ===========
s_if -> "if" _ "(" s_if_condition ")" _ s_sugarBlock_content
    {% args => toASTNode(ast.IfStatement)([args[0], args[3], args.at(-1)]) %}
    | "if" _ "(" s_if_condition ")" _ s_sugarBlock_content _ "else" _ s_sugarBlock_content
    {% args => toASTNode(ast.IfStatement)([args[0], args[3], args[6], args.at(-1)]) %}
    | "if" _ "(" s_if_condition ")" _ s_sugarBlock_content _ "else" nonEmptySpace:+ s_if
    {% args => toASTNode(ast.IfStatement)([args[0], args[3], args[6], args.at(-1)]) %}


s_if_condition -> e_main e_condition_extend e_main {% args => ({ left: args[0], right: args.at(-1) }) %}
#endregion  //*======== if ===========

s_return -> "return" nonEmptySpace:+ e_main 
    {% args => toASTNode(ast.ReturnStatement)([args[0], args.at(-1)]) %}

