@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> (s_main blockSeparator):+ {% args => args[0].map(item => item[0]) %}

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

# s_innerBlock -> "{" s_block:* _ "}" {% args => args[0] %}

# s_sugarBlock -> "1"

# s_sugarBlock_prefixChar -> "^" {% id %}

# s_sugarBlock_content -> s_typeAlias {% id %}
#     | s_if {% id %}

# s_if -> s_if_start 
#     | s_if_start _ "else" _ "{" s_sugarBlock _ "}"
#     | s_if_start _ "else" _ s_if

# s_if_start -> "if" _ "(" s_if_condition ")" _ "{" s_sugarBlock _ "}"

# s_if_condition -> e_main e_condition_extend e_main