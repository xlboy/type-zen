// @ts-nocheck

// @ts-nocheck

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0];
}

declare var literalKeyword: any;
declare var string: any;
declare var number: any;
declare var identifier: any;
declare var ws: any;

import * as ast from '../ast';
import lexer from './moo-lexer';
import { filterAndToASTNode, filterTemplateStringContent, toASTNode } from './utils';

const n = () => null;

interface NearleyToken {
  value: any;
  [key: string]: any;
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
}

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
}

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    { name: 'e_main', symbols: ['e_mainWithoutUnion'], postprocess: id },
    { name: 'e_main', symbols: ['e_union'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_object'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_tuple'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_value'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_function'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_typeReference'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_condition'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_array'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_elementAccess'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_propertyAccess'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_conditionInfer'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_bracketSurround'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_intersection'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_typeOperator'], postprocess: id },
    { name: 'e_mainWithoutUnion', symbols: ['e_sugarBlock'], postprocess: id },
    { name: 'e_typeOperator$subexpression$1', symbols: [{ literal: 'readonly' }] },
    { name: 'e_typeOperator$subexpression$1', symbols: [{ literal: 'keyof' }] },
    { name: 'e_typeOperator$subexpression$1', symbols: [{ literal: 'typeof' }] },
    {
      name: 'e_typeOperator',
      symbols: ['e_typeOperator$subexpression$1', '__', 'e_main'],
      postprocess: (args, d, reject) => {
        const _args = [args[0][0], args.at(-1)];

        return filterAndToASTNode([_args, d, reject], ast.TypeOperatorExpression);
      }
    },
    { name: 'e_function$macrocall$2', symbols: ['e_function_arrow'], postprocess: id },
    {
      name: 'e_function$macrocall$1',
      symbols: [{ literal: 'new' }, '__', 'e_function$macrocall$2'],
      postprocess: args =>
        toASTNode(ast.Function.Mode.ConstructorExpression)([args[0], args.at(-1)])
    },
    { name: 'e_function', symbols: ['e_function$macrocall$1'], postprocess: id },
    { name: 'e_function', symbols: ['e_function_arrow'], postprocess: id },
    {
      name: 'e_function_normal',
      symbols: ['e_function_body', '_', { literal: ':' }, '_', 'e_function_return'],
      postprocess: args =>
        toASTNode(ast.Function.Mode.NormalExpression)([args[0], args.at(-1)])
    },
    {
      name: 'e_function_normal',
      symbols: [
        'e_function_genericArgs',
        '_',
        'e_function_body',
        '_',
        { literal: ':' },
        '_',
        'e_function_return'
      ],
      postprocess: args =>
        toASTNode(ast.Function.Mode.NormalExpression)([args[0], args[2], args.at(-1)])
    },
    {
      name: 'e_function_normal',
      symbols: ['e_function_genericArgs', '_', 'e_function_body'],
      postprocess: args =>
        toASTNode(ast.Function.Mode.NormalExpression)([args[0], args.at(-1)])
    },
    {
      name: 'e_function_normal',
      symbols: ['e_function_body'],
      postprocess: toASTNode(ast.Function.Mode.NormalExpression)
    },
    {
      name: 'e_function_arrow',
      symbols: ['e_function_body', '_', { literal: '=>' }, '_', 'e_function_return'],
      postprocess: args =>
        toASTNode(ast.Function.Mode.ArrowExpression)([args[0], args.at(-1)])
    },
    {
      name: 'e_function_arrow',
      symbols: [
        'e_function_genericArgs',
        '_',
        'e_function_body',
        '_',
        { literal: '=>' },
        '_',
        'e_function_return'
      ],
      postprocess: args =>
        toASTNode(ast.Function.Mode.ArrowExpression)([args[0], args[2], args.at(-1)])
    },
    { name: 'e_function_genericArgs', symbols: ['e_genericArgs'], postprocess: id },
    {
      name: 'e_function_body$ebnf$1$subexpression$1$ebnf$1',
      symbols: [{ literal: '...' }],
      postprocess: id
    },
    {
      name: 'e_function_body$ebnf$1$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_function_body$ebnf$1$subexpression$1$ebnf$2',
      symbols: [{ literal: '?' }],
      postprocess: id
    },
    {
      name: 'e_function_body$ebnf$1$subexpression$1$ebnf$2',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_function_body$ebnf$1$subexpression$1',
      symbols: [
        'e_function_body$ebnf$1$subexpression$1$ebnf$1',
        'id',
        '_',
        'e_function_body$ebnf$1$subexpression$1$ebnf$2',
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ]
    },
    {
      name: 'e_function_body$ebnf$1',
      symbols: ['e_function_body$ebnf$1$subexpression$1'],
      postprocess: id
    },
    { name: 'e_function_body$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'e_function_body$ebnf$2', symbols: [] },
    {
      name: 'e_function_body$ebnf$2$subexpression$1$ebnf$1',
      symbols: [{ literal: '...' }],
      postprocess: id
    },
    {
      name: 'e_function_body$ebnf$2$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_function_body$ebnf$2$subexpression$1$ebnf$2',
      symbols: [{ literal: '?' }],
      postprocess: id
    },
    {
      name: 'e_function_body$ebnf$2$subexpression$1$ebnf$2',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_function_body$ebnf$2$subexpression$1',
      symbols: [
        '_',
        { literal: ',' },
        '_',
        'e_function_body$ebnf$2$subexpression$1$ebnf$1',
        'id',
        '_',
        'e_function_body$ebnf$2$subexpression$1$ebnf$2',
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ]
    },
    {
      name: 'e_function_body$ebnf$2',
      symbols: ['e_function_body$ebnf$2', 'e_function_body$ebnf$2$subexpression$1'],
      postprocess: d => d[0].concat([d[1]])
    },
    { name: 'e_function_body$ebnf$3', symbols: [{ literal: ',' }], postprocess: id },
    { name: 'e_function_body$ebnf$3', symbols: [], postprocess: () => null },
    {
      name: 'e_function_body',
      symbols: [
        { literal: '(' },
        '_',
        'e_function_body$ebnf$1',
        '_',
        'e_function_body$ebnf$2',
        'e_function_body$ebnf$3',
        '_',
        { literal: ')' }
      ],
      postprocess: args => {
        const bodyArgs = [];

        if (args[2]) {
          bodyArgs.push({
            id: args[2][1],
            type: args[2].at(-1),
            rest: !!args[2][0],
            optional: !!args[2][3]
          });
        }

        const restArgs = args[4].map(arg => ({
          id: arg[4],
          type: arg.at(-1),
          rest: !!arg[3],
          optional: !!arg[6]
        }));

        bodyArgs.push(...restArgs);

        return toASTNode(ast.Function.Body.Expression)([args[0], bodyArgs, args.at(-1)]);
      }
    },
    {
      name: 'e_function_return',
      symbols: ['e_function_return_assertsAndIs'],
      postprocess: id
    },
    { name: 'e_function_return', symbols: ['e_function_return_isOnly'], postprocess: id },
    { name: 'e_function_return', symbols: ['e_function_return_normal'], postprocess: id },
    {
      name: 'e_function_return_assertsSource',
      symbols: [{ literal: 'this' }],
      postprocess: id
    },
    { name: 'e_function_return_assertsSource', symbols: ['id'], postprocess: id },
    {
      name: 'e_function_return_assertsAndIs',
      symbols: [
        { literal: 'asserts' },
        '__',
        'e_function_return_assertsSource',
        '__',
        { literal: 'is' },
        '__',
        'e_main'
      ],
      postprocess: args =>
        toASTNode(ast.Function.Return.Expression)([args[0], args[2], args.at(-1)])
    },
    {
      name: 'e_function_return_isOnly',
      symbols: [
        'e_function_return_assertsSource',
        '__',
        { literal: 'is' },
        '__',
        'e_main'
      ],
      postprocess: args =>
        toASTNode(ast.Function.Return.Expression)([args[0], args.at(-1)])
    },
    {
      name: 'e_function_return_normal',
      symbols: ['e_main'],
      postprocess: toASTNode(ast.Function.Return.Expression)
    },
    {
      name: 'e_sugarBlock',
      symbols: [{ literal: '^' }, '_', 'e_sugarBlock_content'],
      postprocess: args => args.at(-1)
    },
    {
      name: 'e_sugarBlock_content$ebnf$1$subexpression$1',
      symbols: ['e_sugarBlock_content_block', 'blockSeparator']
    },
    {
      name: 'e_sugarBlock_content$ebnf$1',
      symbols: ['e_sugarBlock_content$ebnf$1$subexpression$1']
    },
    {
      name: 'e_sugarBlock_content$ebnf$1$subexpression$2',
      symbols: ['e_sugarBlock_content_block', 'blockSeparator']
    },
    {
      name: 'e_sugarBlock_content$ebnf$1',
      symbols: [
        'e_sugarBlock_content$ebnf$1',
        'e_sugarBlock_content$ebnf$1$subexpression$2'
      ],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_sugarBlock_content',
      symbols: [{ literal: '{' }, '_', 'e_sugarBlock_content$ebnf$1', { literal: '}' }],
      postprocess: args =>
        toASTNode(ast.SugarBlockExpression)([args[0], args[2].map(id), args.at(-1)])
    },
    { name: 'e_sugarBlock_content_block', symbols: ['s_typeAlias'], postprocess: id },
    { name: 'e_sugarBlock_content_block', symbols: ['e_sugarBlock_if'], postprocess: id },
    {
      name: 'e_sugarBlock_content_block',
      symbols: ['e_sugarBlock_return'],
      postprocess: id
    },
    {
      name: 'e_sugarBlock_content_block',
      symbols: ['e_sugarBlock_for'],
      postprocess: id
    },
    {
      name: 'e_sugarBlock_if',
      symbols: [
        { literal: 'if' },
        '_',
        { literal: '(' },
        'e_sugarBlock_if_condition',
        { literal: ')' },
        '_',
        'e_sugarBlock_content'
      ],
      postprocess: args =>
        toASTNode(ast.SugarBlockIfExpression)([args[0], args[3], args.at(-1)])
    },
    {
      name: 'e_sugarBlock_if',
      symbols: [
        { literal: 'if' },
        '_',
        { literal: '(' },
        'e_sugarBlock_if_condition',
        { literal: ')' },
        '_',
        'e_sugarBlock_content',
        '_',
        { literal: 'else' },
        '_',
        'e_sugarBlock_content'
      ],
      postprocess: args =>
        toASTNode(ast.SugarBlockIfExpression)([args[0], args[3], args[6], args.at(-1)])
    },
    {
      name: 'e_sugarBlock_if',
      symbols: [
        { literal: 'if' },
        '_',
        { literal: '(' },
        'e_sugarBlock_if_condition',
        { literal: ')' },
        '_',
        'e_sugarBlock_content',
        '_',
        { literal: 'else' },
        '__',
        'e_sugarBlock_if'
      ],
      postprocess: args =>
        toASTNode(ast.SugarBlockIfExpression)([args[0], args[3], args[6], args.at(-1)])
    },
    {
      name: 'e_sugarBlock_if_condition',
      symbols: ['e_main', 'e_condition_extend', 'e_main'],
      postprocess: args => ({ left: args[0], right: args.at(-1) })
    },
    {
      name: 'e_sugarBlock_for',
      symbols: [
        { literal: 'for' },
        '_',
        { literal: '(' },
        'e_sugarBlock_for_mapping',
        '_',
        { literal: ')' },
        '_',
        'e_sugarBlock_content'
      ],
      postprocess: args =>
        toASTNode(ast.SugarBlockForExpression)([args[0], args[3], args.at(-1)])
    },
    {
      name: 'e_sugarBlock_for_mapping',
      symbols: [
        { literal: 'infer' },
        '__',
        'id',
        '__',
        { literal: 'in' },
        '__',
        'e_main'
      ],
      postprocess: args => ({ name: args[2], source: args.at(-1) })
    },
    {
      name: 'e_sugarBlock_return',
      symbols: [{ literal: 'return' }, '__', 'e_main'],
      postprocess: args =>
        toASTNode(ast.SugarBlockReturnExpression)([args[0], args.at(-1)])
    },
    {
      name: 'e_object',
      symbols: [{ literal: '{' }, '_', { literal: '}' }],
      postprocess: args => toASTNode(ast.Object.Expression)([args[0], [], args.at(-1)])
    },
    {
      name: 'e_object$ebnf$1$subexpression$1$ebnf$1',
      symbols: [{ literal: 'readonly' }],
      postprocess: id
    },
    {
      name: 'e_object$ebnf$1$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: () => null
    },
    { name: 'e_object$ebnf$1$subexpression$1$ebnf$2', symbols: ['__'], postprocess: id },
    {
      name: 'e_object$ebnf$1$subexpression$1$ebnf$2',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_object$ebnf$1$subexpression$1',
      symbols: [
        'e_object$ebnf$1$subexpression$1$ebnf$1',
        'e_object$ebnf$1$subexpression$1$ebnf$2',
        'e_object_content',
        '_',
        'e_object_content_eof'
      ]
    },
    { name: 'e_object$ebnf$1', symbols: ['e_object$ebnf$1$subexpression$1'] },
    {
      name: 'e_object$ebnf$1$subexpression$2$ebnf$1',
      symbols: [{ literal: 'readonly' }],
      postprocess: id
    },
    {
      name: 'e_object$ebnf$1$subexpression$2$ebnf$1',
      symbols: [],
      postprocess: () => null
    },
    { name: 'e_object$ebnf$1$subexpression$2$ebnf$2', symbols: ['__'], postprocess: id },
    {
      name: 'e_object$ebnf$1$subexpression$2$ebnf$2',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_object$ebnf$1$subexpression$2',
      symbols: [
        'e_object$ebnf$1$subexpression$2$ebnf$1',
        'e_object$ebnf$1$subexpression$2$ebnf$2',
        'e_object_content',
        '_',
        'e_object_content_eof'
      ]
    },
    {
      name: 'e_object$ebnf$1',
      symbols: ['e_object$ebnf$1', 'e_object$ebnf$1$subexpression$2'],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_object',
      symbols: [{ literal: '{' }, '_', 'e_object$ebnf$1', { literal: '}' }],
      postprocess: args =>
        toASTNode(ast.Object.Expression)([
          args[0],
          args[2].map(item => ({ readonly: !!item[0], value: item[2] })),
          args.at(-1)
        ])
    },
    {
      name: 'e_object_content_eof$subexpression$1$subexpression$1',
      symbols: [{ literal: ',' }]
    },
    {
      name: 'e_object_content_eof$subexpression$1$subexpression$1',
      symbols: [{ literal: ';' }]
    },
    {
      name: 'e_object_content_eof$subexpression$1',
      symbols: ['e_object_content_eof$subexpression$1$subexpression$1', '_']
    },
    { name: 'e_object_content_eof', symbols: ['e_object_content_eof$subexpression$1'] },
    { name: 'e_object_content_eof', symbols: [] },
    { name: 'e_object_content', symbols: ['e_object_content_call'], postprocess: id },
    {
      name: 'e_object_content',
      symbols: ['e_object_content_constructor'],
      postprocess: id
    },
    { name: 'e_object_content', symbols: ['e_object_content_method'], postprocess: id },
    { name: 'e_object_content', symbols: ['e_object_content_normal'], postprocess: id },
    {
      name: 'e_object_content',
      symbols: ['e_object_content_literalIndex'],
      postprocess: id
    },
    {
      name: 'e_object_content',
      symbols: ['e_object_content_indexSignature'],
      postprocess: id
    },
    { name: 'e_object_content', symbols: ['e_object_content_mapped'], postprocess: id },
    { name: 'e_object_content_call', symbols: ['e_function_normal'], postprocess: id },
    {
      name: 'e_object_content_constructor$macrocall$2',
      symbols: ['e_function_normal'],
      postprocess: id
    },
    {
      name: 'e_object_content_constructor$macrocall$1',
      symbols: [{ literal: 'new' }, '__', 'e_object_content_constructor$macrocall$2'],
      postprocess: args =>
        toASTNode(ast.Function.Mode.ConstructorExpression)([args[0], args.at(-1)])
    },
    {
      name: 'e_object_content_constructor',
      symbols: ['e_object_content_constructor$macrocall$1'],
      postprocess: id
    },
    { name: 'e_object_content_key', symbols: ['id'], postprocess: id },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'if' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'for' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'of' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'else' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'in' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'void' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'this' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'function' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'interface' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'namespace' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'keyof' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'typeof' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'type' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'as' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'is' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'out' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'infer' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'asserts' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'declare' }] },
    { name: 'e_object_content_key$subexpression$1', symbols: [{ literal: 'readonly' }] },
    {
      name: 'e_object_content_key',
      symbols: ['e_object_content_key$subexpression$1'],
      postprocess: args => toASTNode(ast.IdentifierExpression)([args[0][0]])
    },
    {
      name: 'e_object_content_method$ebnf$1',
      symbols: [{ literal: '?' }],
      postprocess: id
    },
    { name: 'e_object_content_method$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_object_content_method',
      symbols: [
        'e_object_content_method_key',
        '_',
        'e_object_content_method$ebnf$1',
        '_',
        'e_function_normal'
      ],
      postprocess: args =>
        toASTNode(ast.Object.Content.MethodExpression)([args[0], !!args[2], args.at(-1)])
    },
    {
      name: 'e_object_content_method_key',
      symbols: ['e_object_content_key'],
      postprocess: id
    },
    {
      name: 'e_object_content_normal$ebnf$1',
      symbols: [{ literal: '?' }],
      postprocess: id
    },
    { name: 'e_object_content_normal$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_object_content_normal',
      symbols: [
        'e_object_content_normal_key',
        '_',
        'e_object_content_normal$ebnf$1',
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ],
      postprocess: args =>
        toASTNode(ast.Object.Content.NormalExpression)([args[0], !!args[2], args.at(-1)])
    },
    {
      name: 'e_object_content_normal_key',
      symbols: ['e_object_content_key'],
      postprocess: id
    },
    {
      name: 'e_object_content_normal_key',
      symbols: [{ literal: 'new' }],
      postprocess: toASTNode(ast.IdentifierExpression)
    },
    { name: 'e_object_content_literalIndex$subexpression$1', symbols: ['e_string'] },
    { name: 'e_object_content_literalIndex$subexpression$1', symbols: ['e_number'] },
    {
      name: 'e_object_content_literalIndex$ebnf$1',
      symbols: [{ literal: '?' }],
      postprocess: id
    },
    {
      name: 'e_object_content_literalIndex$ebnf$1',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_object_content_literalIndex',
      symbols: [
        { literal: '[' },
        '_',
        'e_object_content_literalIndex$subexpression$1',
        '_',
        { literal: ']' },
        '_',
        'e_object_content_literalIndex$ebnf$1',
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ],
      postprocess: args =>
        toASTNode(ast.Object.Content.LiteralIndexExpression)([
          args[0],
          args[2][0],
          !!args[6],
          args.at(-1)
        ])
    },
    {
      name: 'e_object_content_indexSignature',
      symbols: [
        { literal: '[' },
        '_',
        'id',
        '_',
        { literal: ':' },
        '_',
        'e_main',
        '_',
        { literal: ']' },
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ],
      postprocess: args =>
        toASTNode(ast.Object.Content.IndexSignatureExpression)([
          args[0],
          args[2],
          args[6],
          args.at(-1)
        ])
    },
    {
      name: 'e_object_content_mapped$subexpression$1$ebnf$1$subexpression$1',
      symbols: ['__', { literal: 'as' }, '__', 'e_main']
    },
    {
      name: 'e_object_content_mapped$subexpression$1$ebnf$1',
      symbols: ['e_object_content_mapped$subexpression$1$ebnf$1$subexpression$1'],
      postprocess: id
    },
    {
      name: 'e_object_content_mapped$subexpression$1$ebnf$1',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_object_content_mapped$subexpression$1',
      symbols: [
        'id',
        '__',
        { literal: 'in' },
        '__',
        'e_main',
        'e_object_content_mapped$subexpression$1$ebnf$1'
      ]
    },
    {
      name: 'e_object_content_mapped$ebnf$1$subexpression$1$subexpression$1',
      symbols: [{ literal: '-' }, '_', { literal: '?' }]
    },
    {
      name: 'e_object_content_mapped$ebnf$1$subexpression$1',
      symbols: ['e_object_content_mapped$ebnf$1$subexpression$1$subexpression$1']
    },
    {
      name: 'e_object_content_mapped$ebnf$1$subexpression$1',
      symbols: [{ literal: '?' }]
    },
    {
      name: 'e_object_content_mapped$ebnf$1',
      symbols: ['e_object_content_mapped$ebnf$1$subexpression$1'],
      postprocess: id
    },
    { name: 'e_object_content_mapped$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_object_content_mapped',
      symbols: [
        { literal: '[' },
        '_',
        'e_object_content_mapped$subexpression$1',
        '_',
        { literal: ']' },
        '_',
        'e_object_content_mapped$ebnf$1',
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ],
      postprocess: args => {
        const hasAsTarget = !!args[2]?.[5];
        const asTarget = hasAsTarget ? args[2][5].at(-1) : false;
        const operator = !!args[6]
          ? Array.isArray(args[6][0])
            ? [true, true]
            : [false, true]
          : [false, false];

        return toASTNode(ast.Object.Content.MappedExpression)([
          args[0],
          args[2][0],
          args[2][4],
          asTarget,
          operator,
          args.at(-1)
        ]);
      }
    },
    { name: 'e_genericArgs$ebnf$1', symbols: [] },
    {
      name: 'e_genericArgs$ebnf$1$subexpression$1',
      symbols: ['_', { literal: ',' }, '_', 'id', 'e_genericArgs_group']
    },
    {
      name: 'e_genericArgs$ebnf$1',
      symbols: ['e_genericArgs$ebnf$1', 'e_genericArgs$ebnf$1$subexpression$1'],
      postprocess: d => d[0].concat([d[1]])
    },
    { name: 'e_genericArgs$ebnf$2', symbols: [{ literal: ',' }], postprocess: id },
    { name: 'e_genericArgs$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'e_genericArgs',
      symbols: [
        { literal: '<' },
        '_',
        'id',
        'e_genericArgs_group',
        'e_genericArgs$ebnf$1',
        'e_genericArgs$ebnf$2',
        '_',
        { literal: '>' }
      ],
      postprocess: args => {
        const firstArg = Object.assign(
          { id: args[2], type: void 0, default: void 0 },
          args[3] || {}
        );
        const restArgs = args[4].map(arg => {
          return Object.assign(
            { id: arg[3], type: void 0, default: void 0 },
            arg[4] || {}
          );
        });

        return toASTNode(ast.GenericArgsExpression)([
          args[0],
          [firstArg, ...restArgs],
          args.at(-1)
        ]);
      }
    },
    {
      name: 'e_genericArgs_group$ebnf$1$subexpression$1$subexpression$1',
      symbols: ['_', { literal: ':' }, '_', 'e_main']
    },
    {
      name: 'e_genericArgs_group$ebnf$1$subexpression$1',
      symbols: ['e_genericArgs_group$ebnf$1$subexpression$1$subexpression$1']
    },
    {
      name: 'e_genericArgs_group$ebnf$1$subexpression$1$subexpression$2',
      symbols: ['__', { literal: 'extends' }, '__', 'e_main']
    },
    {
      name: 'e_genericArgs_group$ebnf$1$subexpression$1',
      symbols: ['e_genericArgs_group$ebnf$1$subexpression$1$subexpression$2']
    },
    {
      name: 'e_genericArgs_group$ebnf$1',
      symbols: ['e_genericArgs_group$ebnf$1$subexpression$1'],
      postprocess: id
    },
    { name: 'e_genericArgs_group$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_genericArgs_group$ebnf$2$subexpression$1',
      symbols: ['_', { literal: '=' }, '_', 'e_main']
    },
    {
      name: 'e_genericArgs_group$ebnf$2',
      symbols: ['e_genericArgs_group$ebnf$2$subexpression$1'],
      postprocess: id
    },
    { name: 'e_genericArgs_group$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'e_genericArgs_group',
      symbols: ['e_genericArgs_group$ebnf$1', 'e_genericArgs_group$ebnf$2'],
      postprocess: args => {
        const type = args[0]?.[0]?.at(-1);
        const _default = args[1]?.at(-1);

        return type || _default ? { type, default: _default } : null;
      }
    },
    {
      name: 'e_elementAccess',
      symbols: ['e_main', '_', { literal: '[' }, '_', 'e_main', '_', { literal: ']' }],
      postprocess: (...args) => filterAndToASTNode(args, ast.ElementAccessExpression)
    },
    {
      name: 'e_propertyAccess$ebnf$1$subexpression$1',
      symbols: [{ literal: '.' }, '_', 'id']
    },
    {
      name: 'e_propertyAccess$ebnf$1',
      symbols: ['e_propertyAccess$ebnf$1$subexpression$1']
    },
    {
      name: 'e_propertyAccess$ebnf$1$subexpression$2',
      symbols: [{ literal: '.' }, '_', 'id']
    },
    {
      name: 'e_propertyAccess$ebnf$1',
      symbols: ['e_propertyAccess$ebnf$1', 'e_propertyAccess$ebnf$1$subexpression$2'],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_propertyAccess',
      symbols: ['id', '_', 'e_propertyAccess$ebnf$1'],
      postprocess: args =>
        toASTNode(ast.PropertyAccessExpression)([
          args[0],
          ...args[2].map(item => item.at(-1))
        ])
    },
    {
      name: 'e_tuple',
      symbols: [{ literal: '[' }, '_', { literal: ']' }],
      postprocess: args => toASTNode(ast.TupleExpression)([args[0], [], args.at(-1)])
    },
    { name: 'e_tuple$ebnf$1', symbols: [{ literal: ',' }], postprocess: id },
    { name: 'e_tuple$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_tuple',
      symbols: [
        { literal: '[' },
        '_',
        'e_tuple_value',
        '_',
        'e_tuple$ebnf$1',
        '_',
        { literal: ']' }
      ],
      postprocess: args =>
        toASTNode(ast.TupleExpression)([args[0], [args[2]], args.at(-1)])
    },
    { name: 'e_tuple$ebnf$2', symbols: [] },
    {
      name: 'e_tuple$ebnf$2$subexpression$1',
      symbols: ['_', { literal: ',' }, '_', 'e_tuple_value']
    },
    {
      name: 'e_tuple$ebnf$2',
      symbols: ['e_tuple$ebnf$2', 'e_tuple$ebnf$2$subexpression$1'],
      postprocess: d => d[0].concat([d[1]])
    },
    { name: 'e_tuple$ebnf$3$subexpression$1', symbols: ['_', { literal: ',' }] },
    {
      name: 'e_tuple$ebnf$3',
      symbols: ['e_tuple$ebnf$3$subexpression$1'],
      postprocess: id
    },
    { name: 'e_tuple$ebnf$3', symbols: [], postprocess: () => null },
    {
      name: 'e_tuple',
      symbols: [
        { literal: '[' },
        '_',
        'e_tuple_value',
        'e_tuple$ebnf$2',
        'e_tuple$ebnf$3',
        '_',
        { literal: ']' }
      ],
      postprocess: args =>
        toASTNode(ast.TupleExpression)([
          args[0],
          [args[2], ...args[3].map(item => item.at(-1))],
          args.at(-1)
        ])
    },
    {
      name: 'e_tuple_value',
      symbols: ['e_main', '_', { literal: '?' }],
      postprocess: args => ({
        id: false,
        deconstruction: false,
        type: args[0],
        optional: true
      })
    },
    {
      name: 'e_tuple_value',
      symbols: ['e_main'],
      postprocess: args => ({
        id: false,
        deconstruction: false,
        type: args[0],
        optional: false
      })
    },
    {
      name: 'e_tuple_value',
      symbols: [{ literal: '...' }, 'e_main'],
      postprocess: args => ({
        id: false,
        deconstruction: true,
        type: args[1],
        optional: false
      })
    },
    { name: 'e_tuple_value$ebnf$1', symbols: [{ literal: '?' }], postprocess: id },
    { name: 'e_tuple_value$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_tuple_value',
      symbols: ['id', '_', 'e_tuple_value$ebnf$1', '_', { literal: ':' }, '_', 'e_main'],
      postprocess: args => ({
        id: args[0],
        deconstruction: false,
        type: args.at(-1),
        optional: !!args[2]
      })
    },
    {
      name: 'e_tuple_value',
      symbols: [{ literal: '...' }, 'id', '_', { literal: ':' }, '_', 'e_main'],
      postprocess: args => ({
        id: args[1],
        deconstruction: true,
        type: args.at(-1),
        optional: false
      })
    },
    {
      name: 'e_array',
      symbols: ['e_main', { literal: '[' }, { literal: ']' }],
      postprocess: (...args) => filterAndToASTNode(args, ast.ArrayExpression)
    },
    {
      name: 'e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1',
      symbols: []
    },
    {
      name: 'e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1$subexpression$1',
      symbols: ['_', { literal: ',' }, '_', 'e_main']
    },
    {
      name: 'e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1',
      symbols: [
        'e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1',
        'e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1$subexpression$1'
      ],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_typeReference$ebnf$1$subexpression$1$subexpression$1',
      symbols: [
        '_',
        'e_main',
        'e_typeReference$ebnf$1$subexpression$1$subexpression$1$ebnf$1'
      ],
      postprocess: args => [args[1], ...args[2].map(item => item[3])]
    },
    {
      name: 'e_typeReference$ebnf$1$subexpression$1',
      symbols: [
        { literal: '<' },
        'e_typeReference$ebnf$1$subexpression$1$subexpression$1',
        '_',
        { literal: '>' }
      ]
    },
    {
      name: 'e_typeReference$ebnf$1',
      symbols: ['e_typeReference$ebnf$1$subexpression$1'],
      postprocess: id
    },
    { name: 'e_typeReference$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_typeReference',
      symbols: ['id', '_', 'e_typeReference$ebnf$1'],
      postprocess: args =>
        toASTNode(ast.TypeReferenceExpression)([args[0], ...(args[2] || [])])
    },
    {
      name: 'e_bracketSurround',
      symbols: [{ literal: '(' }, '_', 'e_main', '_', { literal: ')' }],
      postprocess: toASTNode(ast.BracketSurroundExpression)
    },
    {
      name: 'e_condition',
      symbols: [
        'e_main',
        'e_condition_extend',
        'e_main',
        '_',
        { literal: '?' },
        '_',
        'e_main',
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ],
      postprocess: (...args) => filterAndToASTNode(args, ast.ConditionExpression)
    },
    { name: 'e_conditionInfer$ebnf$1', symbols: [] },
    {
      name: 'e_conditionInfer$ebnf$1$subexpression$1',
      symbols: ['e_condition_extend', 'e_main']
    },
    {
      name: 'e_conditionInfer$ebnf$1',
      symbols: ['e_conditionInfer$ebnf$1', 'e_conditionInfer$ebnf$1$subexpression$1'],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_conditionInfer',
      symbols: [{ literal: 'infer' }, '__', 'id', 'e_conditionInfer$ebnf$1'],
      postprocess: args => {
        if (args[3].length === 0) {
          return toASTNode(ast.InferExpression)([args[0], args[2]]);
        }

        return toASTNode(ast.InferExpression)([
          args[0],
          args[2],
          args[3].map(item => item.at(-1))
        ]);
      }
    },
    {
      name: 'e_condition_extend$subexpression$1',
      symbols: ['__', { literal: 'extends' }, '__']
    },
    { name: 'e_condition_extend', symbols: ['e_condition_extend$subexpression$1'] },
    {
      name: 'e_condition_extend$subexpression$2',
      symbols: ['_', { literal: '==' }, '_']
    },
    { name: 'e_condition_extend', symbols: ['e_condition_extend$subexpression$2'] },
    {
      name: 'e_value',
      symbols: [
        lexer.has('literalKeyword') ? { type: 'literalKeyword' } : literalKeyword
      ],
      postprocess: toASTNode(ast.LiteralKeywordExpression)
    },
    { name: 'e_value', symbols: ['e_string'], postprocess: id },
    { name: 'e_value', symbols: ['e_number'], postprocess: id },
    {
      name: 'e_string',
      symbols: [lexer.has('string') ? { type: 'string' } : string],
      postprocess: toASTNode(ast.StringLiteralExpression)
    },
    {
      name: 'e_number',
      symbols: [lexer.has('number') ? { type: 'number' } : number],
      postprocess: toASTNode(ast.NumberLiteralExpression)
    },
    {
      name: 'e_templateString',
      symbols: [{ literal: '`' }, { literal: '`' }],
      postprocess: args =>
        toASTNode(ast.TemplateStringExpression)([args[0], [], args.at(-1)])
    },
    { name: 'e_templateString$ebnf$1', symbols: [/[^`]/] },
    {
      name: 'e_templateString$ebnf$1',
      symbols: ['e_templateString$ebnf$1', /[^`]/],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_templateString',
      symbols: [{ literal: '`' }, 'e_templateString$ebnf$1', { literal: '`' }],
      postprocess: args => {
        return toASTNode(ast.TemplateStringExpression)([
          args[0],
          filterTemplateStringContent(args[1]),
          args.at(-1)
        ]);
      }
    },
    {
      name: 'e_union_mode1$macrocall$2$subexpression$1',
      symbols: ['e_mainWithoutUnion']
    },
    { name: 'e_union_mode1$macrocall$2$subexpression$1', symbols: ['e_union_mode2'] },
    {
      name: 'e_union_mode1$macrocall$2',
      symbols: ['e_union_mode1$macrocall$2$subexpression$1'],
      postprocess: id
    },
    { name: 'e_union_mode1$macrocall$1$ebnf$1', symbols: [] },
    {
      name: 'e_union_mode1$macrocall$1$ebnf$1$subexpression$1',
      symbols: ['_', { literal: ',' }, '_', 'e_union_mode1$macrocall$2']
    },
    {
      name: 'e_union_mode1$macrocall$1$ebnf$1',
      symbols: [
        'e_union_mode1$macrocall$1$ebnf$1',
        'e_union_mode1$macrocall$1$ebnf$1$subexpression$1'
      ],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_union_mode1$macrocall$1$ebnf$2',
      symbols: [{ literal: ',' }],
      postprocess: id
    },
    { name: 'e_union_mode1$macrocall$1$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'e_union_mode1$macrocall$1',
      symbols: [
        'e_union_mode1$macrocall$2',
        'e_union_mode1$macrocall$1$ebnf$1',
        'e_union_mode1$macrocall$1$ebnf$2'
      ],
      postprocess: args => [args[0], ...args[1].map(x => x[3])]
    },
    {
      name: 'e_union_mode1',
      symbols: [
        { literal: '|' },
        '_',
        { literal: '[' },
        '_',
        'e_union_mode1$macrocall$1',
        '_',
        { literal: ']' }
      ],
      postprocess: args =>
        toASTNode(ast.UnionExpression)([
          args[0],
          args[2],
          args[4].map(item => item[0]),
          args.at(-1)
        ])
    },
    { name: 'e_union_mode2$ebnf$1$subexpression$1', symbols: [{ literal: '|' }, '_'] },
    {
      name: 'e_union_mode2$ebnf$1',
      symbols: ['e_union_mode2$ebnf$1$subexpression$1'],
      postprocess: id
    },
    { name: 'e_union_mode2$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'e_union_mode2$ebnf$2$subexpression$1',
      symbols: ['_', { literal: '|' }, '_', 'e_mainWithoutUnion']
    },
    { name: 'e_union_mode2$ebnf$2', symbols: ['e_union_mode2$ebnf$2$subexpression$1'] },
    {
      name: 'e_union_mode2$ebnf$2$subexpression$2',
      symbols: ['_', { literal: '|' }, '_', 'e_mainWithoutUnion']
    },
    {
      name: 'e_union_mode2$ebnf$2',
      symbols: ['e_union_mode2$ebnf$2', 'e_union_mode2$ebnf$2$subexpression$2'],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_union_mode2',
      symbols: ['e_union_mode2$ebnf$1', 'e_mainWithoutUnion', 'e_union_mode2$ebnf$2'],
      postprocess: (args, d, reject) => {
        const _args = [[args[1], ...args[2].map(item => item[3])]];

        return filterAndToASTNode([_args, d, reject], ast.UnionExpression);
      }
    },
    { name: 'e_union', symbols: ['e_union_mode1'], postprocess: id },
    { name: 'e_union', symbols: ['e_union_mode2'], postprocess: id },
    { name: 'e_intersection_mode1$macrocall$2', symbols: ['e_main'] },
    { name: 'e_intersection_mode1$macrocall$1$ebnf$1', symbols: [] },
    {
      name: 'e_intersection_mode1$macrocall$1$ebnf$1$subexpression$1',
      symbols: ['_', { literal: ',' }, '_', 'e_intersection_mode1$macrocall$2']
    },
    {
      name: 'e_intersection_mode1$macrocall$1$ebnf$1',
      symbols: [
        'e_intersection_mode1$macrocall$1$ebnf$1',
        'e_intersection_mode1$macrocall$1$ebnf$1$subexpression$1'
      ],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_intersection_mode1$macrocall$1$ebnf$2',
      symbols: [{ literal: ',' }],
      postprocess: id
    },
    {
      name: 'e_intersection_mode1$macrocall$1$ebnf$2',
      symbols: [],
      postprocess: () => null
    },
    {
      name: 'e_intersection_mode1$macrocall$1',
      symbols: [
        'e_intersection_mode1$macrocall$2',
        'e_intersection_mode1$macrocall$1$ebnf$1',
        'e_intersection_mode1$macrocall$1$ebnf$2'
      ],
      postprocess: args => [args[0], ...args[1].map(x => x[3])]
    },
    {
      name: 'e_intersection_mode1',
      symbols: [
        { literal: '&' },
        '_',
        { literal: '[' },
        '_',
        'e_intersection_mode1$macrocall$1',
        '_',
        { literal: ']' }
      ],
      postprocess: args =>
        toASTNode(ast.IntersectionExpression)([args[0], args[4].map(id), args.at(-1)])
    },
    {
      name: 'e_intersection_mode2$ebnf$1$subexpression$1',
      symbols: ['_', { literal: '&' }, '_', 'e_main']
    },
    {
      name: 'e_intersection_mode2$ebnf$1',
      symbols: ['e_intersection_mode2$ebnf$1$subexpression$1']
    },
    {
      name: 'e_intersection_mode2$ebnf$1$subexpression$2',
      symbols: ['_', { literal: '&' }, '_', 'e_main']
    },
    {
      name: 'e_intersection_mode2$ebnf$1',
      symbols: [
        'e_intersection_mode2$ebnf$1',
        'e_intersection_mode2$ebnf$1$subexpression$2'
      ],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'e_intersection_mode2',
      symbols: ['e_main', 'e_intersection_mode2$ebnf$1'],
      postprocess: (args, d, reject) => {
        const _args = [[args[0], ...args[1].map(item => item.at(-1))]];

        return filterAndToASTNode([_args, d, reject], ast.IntersectionExpression);
      }
    },
    { name: 'e_intersection', symbols: ['e_intersection_mode1'], postprocess: id },
    { name: 'e_intersection', symbols: ['e_intersection_mode2'], postprocess: id },
    { name: 'blockSeparator$ebnf$1', symbols: [{ literal: ';' }] },
    {
      name: 'blockSeparator$ebnf$1',
      symbols: ['blockSeparator$ebnf$1', { literal: ';' }],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 'blockSeparator',
      symbols: ['_', 'blockSeparator$ebnf$1', '_'],
      postprocess: n
    },
    { name: 'blockSeparator', symbols: ['_'], postprocess: n },
    {
      name: 'id',
      symbols: [lexer.has('identifier') ? { type: 'identifier' } : identifier],
      postprocess: toASTNode(ast.IdentifierExpression)
    },
    {
      name: '__$ebnf$1$subexpression$1',
      symbols: [lexer.has('ws') ? { type: 'ws' } : ws]
    },
    { name: '__$ebnf$1', symbols: ['__$ebnf$1$subexpression$1'] },
    {
      name: '__$ebnf$1$subexpression$2',
      symbols: [lexer.has('ws') ? { type: 'ws' } : ws]
    },
    {
      name: '__$ebnf$1',
      symbols: ['__$ebnf$1', '__$ebnf$1$subexpression$2'],
      postprocess: d => d[0].concat([d[1]])
    },
    { name: '__', symbols: ['__$ebnf$1'], postprocess: n },
    { name: '_$ebnf$1', symbols: ['__'], postprocess: id },
    { name: '_$ebnf$1', symbols: [], postprocess: () => null },
    { name: '_', symbols: ['_$ebnf$1'], postprocess: n },
    { name: 's_block$ebnf$1$subexpression$1', symbols: ['s_main', 'blockSeparator'] },
    { name: 's_block$ebnf$1', symbols: ['s_block$ebnf$1$subexpression$1'] },
    { name: 's_block$ebnf$1$subexpression$2', symbols: ['s_main', 'blockSeparator'] },
    {
      name: 's_block$ebnf$1',
      symbols: ['s_block$ebnf$1', 's_block$ebnf$1$subexpression$2'],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 's_block',
      symbols: ['s_block$ebnf$1'],
      postprocess: args => args[0].map(id)
    },
    { name: 's_main', symbols: ['s_typeAlias'], postprocess: id },
    { name: 's_main', symbols: ['s_declareVariable'], postprocess: id },
    { name: 's_main', symbols: ['s_declareFunction'], postprocess: id },
    { name: 's_main', symbols: ['s_enum'], postprocess: id },
    { name: 's_main', symbols: ['s_interface'], postprocess: id },
    { name: 's_typeAlias$ebnf$1$subexpression$1', symbols: ['e_genericArgs', '_'] },
    {
      name: 's_typeAlias$ebnf$1',
      symbols: ['s_typeAlias$ebnf$1$subexpression$1'],
      postprocess: id
    },
    { name: 's_typeAlias$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 's_typeAlias',
      symbols: [
        { literal: 'type' },
        '__',
        'id',
        '_',
        's_typeAlias$ebnf$1',
        { literal: '=' },
        '_',
        'e_main'
      ],
      postprocess: args =>
        toASTNode(ast.TypeAliasStatement)([
          args[0],
          args[2],
          args[4]?.[0] || void 0,
          args.at(-1)
        ])
    },
    { name: 's_interface$ebnf$1$subexpression$1', symbols: ['e_genericArgs', '_'] },
    {
      name: 's_interface$ebnf$1',
      symbols: ['s_interface$ebnf$1$subexpression$1'],
      postprocess: id
    },
    { name: 's_interface$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 's_interface',
      symbols: [
        { literal: 'interface' },
        '__',
        'id',
        '_',
        's_interface$ebnf$1',
        'e_object'
      ],
      postprocess: args =>
        toASTNode(ast.InterfaceStatement)([
          args[0],
          args[2],
          args[4]?.[0] || void 0,
          args.at(-1)
        ])
    },
    {
      name: 's_declareVariable',
      symbols: [{ literal: 'declare' }, '__', 's_declareVariable_type', '__', 'id'],
      postprocess: args =>
        toASTNode(ast.DeclareVariableStatement)([args[0], args[2], args.at(-1)])
    },
    {
      name: 's_declareVariable',
      symbols: [
        { literal: 'declare' },
        '__',
        's_declareVariable_type',
        '__',
        'id',
        '_',
        { literal: ':' },
        '_',
        'e_main'
      ],
      postprocess: args =>
        toASTNode(ast.DeclareVariableStatement)([args[0], args[2], args[4], args.at(-1)])
    },
    { name: 's_declareVariable_type$subexpression$1', symbols: [{ literal: 'const' }] },
    { name: 's_declareVariable_type$subexpression$1', symbols: [{ literal: 'let' }] },
    { name: 's_declareVariable_type$subexpression$1', symbols: [{ literal: 'var' }] },
    {
      name: 's_declareVariable_type',
      symbols: ['s_declareVariable_type$subexpression$1'],
      postprocess: args => args[0][0].value
    },
    {
      name: 's_declareFunction',
      symbols: [{ literal: 'declare' }, '__', { literal: 'function' }, '__', 'id'],
      postprocess: args => toASTNode(ast.DeclareFunctionStatement)([args[0], args.at(-1)])
    },
    {
      name: 's_declareFunction',
      symbols: [
        { literal: 'declare' },
        '__',
        { literal: 'function' },
        '__',
        'id',
        '_',
        'e_function_normal'
      ],
      postprocess: args =>
        toASTNode(ast.DeclareFunctionStatement)([args[0], args[4], args.at(-1)])
    },
    {
      name: 's_enum',
      symbols: [
        { literal: 'enum' },
        '__',
        'id',
        '_',
        { literal: '{' },
        '_',
        { literal: '}' }
      ],
      postprocess: args =>
        toASTNode(ast.EnumStatement)([args[0], args[2], [], args.at(-1)])
    },
    {
      name: 's_enum',
      symbols: [
        { literal: 'const' },
        '__',
        { literal: 'enum' },
        '__',
        'id',
        '_',
        { literal: '{' },
        '_',
        { literal: '}' }
      ],
      postprocess: args =>
        toASTNode(ast.EnumStatement)([args[0], args[4], [], args.at(-1)])
    },
    {
      name: 's_enum$ebnf$1$subexpression$1',
      symbols: ['s_enum_member', '_', 's_enum_member_eof']
    },
    { name: 's_enum$ebnf$1', symbols: ['s_enum$ebnf$1$subexpression$1'] },
    {
      name: 's_enum$ebnf$1$subexpression$2',
      symbols: ['s_enum_member', '_', 's_enum_member_eof']
    },
    {
      name: 's_enum$ebnf$1',
      symbols: ['s_enum$ebnf$1', 's_enum$ebnf$1$subexpression$2'],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 's_enum',
      symbols: [
        { literal: 'enum' },
        '__',
        'id',
        '_',
        { literal: '{' },
        '_',
        's_enum$ebnf$1',
        { literal: '}' }
      ],
      postprocess: args =>
        toASTNode(ast.EnumStatement)([args[0], args[2], args[6].map(id), args.at(-1)])
    },
    {
      name: 's_enum$ebnf$2$subexpression$1',
      symbols: ['s_enum_member', '_', 's_enum_member_eof']
    },
    { name: 's_enum$ebnf$2', symbols: ['s_enum$ebnf$2$subexpression$1'] },
    {
      name: 's_enum$ebnf$2$subexpression$2',
      symbols: ['s_enum_member', '_', 's_enum_member_eof']
    },
    {
      name: 's_enum$ebnf$2',
      symbols: ['s_enum$ebnf$2', 's_enum$ebnf$2$subexpression$2'],
      postprocess: d => d[0].concat([d[1]])
    },
    {
      name: 's_enum',
      symbols: [
        { literal: 'const' },
        '__',
        { literal: 'enum' },
        '__',
        'id',
        '_',
        { literal: '{' },
        '_',
        's_enum$ebnf$2',
        { literal: '}' }
      ],
      postprocess: args =>
        toASTNode(ast.EnumStatement)([args[0], args[4], args[8].map(id), args.at(-1)])
    },
    { name: 's_enum_member$subexpression$1', symbols: ['e_number'] },
    { name: 's_enum_member$subexpression$1', symbols: ['e_string'] },
    {
      name: 's_enum_member',
      symbols: ['id', '_', { literal: '=' }, '_', 's_enum_member$subexpression$1'],
      postprocess: args => toASTNode(ast.EnumMemberExpression)([args[0], args.at(-1)[0]])
    },
    {
      name: 's_enum_member',
      symbols: ['id', '_'],
      postprocess: args => toASTNode(ast.EnumMemberExpression)([args[0]])
    },
    { name: 's_enum_member_eof', symbols: [{ literal: ',' }, '_'], postprocess: n },
    { name: 's_enum_member_eof', symbols: [] },
    { name: 'main', symbols: [], postprocess: n },
    { name: 'main', symbols: ['_', 's_block'], postprocess: ([, block]) => block },
    { name: 'main', symbols: ['_'], postprocess: n }
  ],
  ParserStart: 'main'
};

export default grammar;
