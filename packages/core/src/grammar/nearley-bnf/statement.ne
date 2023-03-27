@lexer lexer

@include "./expression.ne"
@include "./common.ne"

s_block -> s_main
    | (s_main blockSeparator):+ {% args => args[0].map(id) %}
    | (s_main blockSeparator):+ s_main {% args => [...args[0].map(id), args.at(-1)] %}
  

s_main ->  s_typeAlias {% id %}
    | s_declareVariable {% id %}
    | s_declareFunction {% id %}
    | s_enum {% id %}
    | s_interface {% id %}

s_typeAlias -> "type" __ id _ (e_genericArgs _):? "=" _ e_main 
    {% args => toASTNode(ast.TypeAliasStatement)([args[0], args[2], args[4]?.[0] || void 0, args.at(-1)]) %}
  
s_interface -> "interface" __ id _ (e_genericArgs _):? e_object
    {% args => toASTNode(ast.InterfaceStatement)([args[0], args[2], args[4]?.[0] || void 0, args.at(-1)]) %}

#region  //*=========== declare variable ===========
s_declareVariable -> "declare" __ s_declareVariable_type __ id 
    {% args => toASTNode(ast.DeclareVariableStatement)([args[0], args[2], args.at(-1)]) %}
    | "declare" __ s_declareVariable_type __ id _ ":" _ e_main
        {% args => toASTNode(ast.DeclareVariableStatement)([args[0], args[2], args[4], args.at(-1)]) %}

s_declareVariable_type -> ("const" | "let" | "var") {% args => args[0][0].value%}
#endregion  //*======== declare variable ===========

#region  //*=========== export/import ===========
s_export -> "export" __ s_export_named

s_export_named -> "export" __ (s_typeAlias | s_enum | s_interface)
s_export_default -> "export" __ "default" __ e_main
s_export_all -> "export" __ "*" __ "from" __ e_string
    | "export" __ "type" __ "*" __ "from" __ e_string


#endregion  //*======== export/import ===========

s_declareFunction -> "declare" __ "function" __ id
    {% args => toASTNode(ast.DeclareFunctionStatement)([args[0], args.at(-1)])%}
    | "declare" __ "function" __ id _ e_function_normal
        {% args => toASTNode(ast.DeclareFunctionStatement)([args[0], args[4], args.at(-1)])%}

#region  //*=========== enum ===========
s_enum -> "enum" __ id _ "{" _ "}" 
    {% args => toASTNode(ast.EnumStatement)([args[0], args[2], [], args.at(-1)]) %}

    | "const" __ "enum" __ id _ "{" _ "}" 
        {% args => toASTNode(ast.EnumStatement)([args[0], args[4], [], args.at(-1)]) %}

    | "enum" __ id _ "{" _ (s_enum_member _ s_enum_member_eof):+ "}" 
        {% args => toASTNode(ast.EnumStatement)([args[0], args[2], args[6].map(id), args.at(-1)]) %}

    | "const" __ "enum" __ id _ "{" _ (s_enum_member _ s_enum_member_eof):+ "}" 
        {% args => toASTNode(ast.EnumStatement)([args[0], args[4], args[8].map(id), args.at(-1)]) %}
    
s_enum_member -> id _ "=" _ (e_number | e_string) 
    {% args => toASTNode(ast.EnumMemberExpression)([args[0], args.at(-1)[0]]) %}
    | id _ {% args => toASTNode(ast.EnumMemberExpression)([args[0]]) %}

s_enum_member_eof -> "," _ {% n %} | null
#endregion  //*======== enum ===========
