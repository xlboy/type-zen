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
    | s_export {% id %}

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

#region  //*=========== export ===========
s_export -> s_export_named {% id %}
    | s_export_default {% id %}
    | s_export_multipleNamed {% id %}
    | s_export_re {% id %}

# export type $id = ...
# export interface $id { ... }
s_export_named -> "export" __ (s_typeAlias | s_enum | s_interface)
    {% args => toASTNode(ast.Export.NamedStatement)([args[0], args.at(-1)[0]]) %}

s_export_multipleNamed -> "export" _ s_export_aggregation
    {% args => toASTNode(ast.Export.MultipleNamedStatement)([args[0], { aggregation: args.at(-1)[0] }, args.at(-1)[1]]) %}
    | "export" __ "type" __ s_export_aggregation
        {% args => toASTNode(ast.Export.MultipleNamedStatement)([args[0], { type: true, aggregation: args.at(-1)[0] }, args.at(-1)[1]]) %}

# export default $id
s_export_default -> "export" __ "default" __ id
    {% args => toASTNode(ast.Export.DefaultStatement)([args[0], args.at(-1)]) %}
    
s_export_re -> 
      # export * from '...'
      "export" __ "*" __ "from" __ e_string
        {% args => toASTNode(ast.Export.ReStatement)([args[0], {}, args.at(-1)]) %}
      # export type * from '...'
    | "export" __ "type" __ "*" __ "from" __ e_string
        {% args => toASTNode(ast.Export.ReStatement)([args[0], { type: true }, args.at(-1)]) %}

      # export * as $id from '...'
    | "export" __ "*" __ "as" __ id __ "from" __ e_string
        {% args => toASTNode(ast.Export.ReStatement)([args[0], { asTarget: args[6] }, args.at(-1)]) %}
      # export type * as $id from '...'
    | "export" __ "type" __ "*" __ "as" __ id __ "from" __ e_string
        {% args => toASTNode(ast.Export.ReStatement)([args[0], { type: true, asTarget: args[8] }, args.at(-1)]) %}

      # export { ... } from '...'
    | "export" __ s_export_aggregation __ "from" __ e_string
        {% args => toASTNode(ast.Export.ReStatement)([args[0], { aggregation: args[2][0] }, args.at(-1)]) %}
      # export type { ... } from '...'
    | "export" __ "type" __ s_export_aggregation __ "from" __ e_string
        {% args => toASTNode(ast.Export.ReStatement)([args[0], { type: true, aggregation: args[4][0] }, args.at(-1)]) %}

s_export_aggregation -> "{" _ "}" {% args => [[], args.at(-1)]%}
    | "{" _ (s_export_aggregation_content _ s_export_aggregation_eof):+ "}" 
        {% args => [args[2].map(id), args.at(-1)] %}
s_export_aggregation_eof -> ("," _) | null
s_export_aggregation_content -> id {% args => ({ id: args[0] }) %}
    | id __ "as" __ id {% args => ({ id: args[0], asTarget: args.at(-1) }) %}
    | "type" __ id {% args => ({ id: args.at(-1), type: true }) %}
    | "type" __ id __ "as" __ id {% args => ({ id: args[2], asTarget: args.at(-1), type: true }) %}
#endregion  //*======== export ===========

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
