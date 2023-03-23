import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from './';
import { arrayExpressions } from './array';
import { bracketSurroundExpressions } from './bracket-surround';
import { conditionExpressions } from './condition';
import { elementAccessExpressions } from './element-access';
import { functionExpressions } from './function';
import { identifierTemplates } from './identifier';
import { intersectionExpressions } from './intersection';
import { literalExpressions } from './literal';
import { tupleExpressions } from './tuple';
import { unionExpressions } from './union';

export { expressions as objectExpressions };

type ObjectContentName = Uncapitalize<
  keyof typeof ast.Object.Content
> extends `${infer T}Expression`
  ? T
  : never;
type ObjectExpressions = {
  simple: Record<ObjectContentName | 'empty', Expression[]>;
  complex: Record<ObjectContentName, Expression[]>;
  all: Expression[];
};
const expressions: ObjectExpressions = {
  complex: {
    call: [],
    constructor: [],
    method: [],
    indexSignature: [],
    literalIndex: [],
    mapped: [],
    normal: []
  },
  simple: {
    call: [],
    constructor: [],
    method: [],
    indexSignature: [],
    literalIndex: [],
    mapped: [],
    normal: [],
    empty: []
  },
  all: []
};

function generateObjectOutput(
  contents: Array<{ text: string; readonly: boolean; operator?: string }>
) {
  return utils.mergeString(
    '{\n',
    contents
      .map(
        item =>
          `  ${item.readonly ? (item.operator || '') + 'readonly ' : ''}${
            item.text
          };` /* ';' 结尾（取决于 compiler.config.memberSeparator，默认为 ';'） */
      )
      .join('\n'),
    '\n}'
  );
}

(function initSimple() {
  expressions.simple.empty = [
    {
      content: `{}`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: '{}',
        contents: []
      })
    },
    {
      content: `{       \n    \n\n}`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: '{}',
        contents: []
      })
    }
  ];
  expressions.simple.call = [
    {
      content: `{ (): void }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: '(): void', readonly: false }]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.CallExpression,
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                outputStr: 'void'
              }),
              outputStr: '(): void'
            })
          }
        ]
      })
    },
    {
      content: `{ 
        (name: string, age?: number):string,
        ():void;
        ()
        <T>()
      }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          {
            text: '(name: string, age?: number): string',
            readonly: false
          },
          { text: '(): void', readonly: false },
          { text: '()', readonly: false },
          { text: '<T>()', readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.CallExpression,
              body: utils.createNode({
                instance: ast.Function.Body.Expression,
                args: [
                  {
                    id: utils.createNode({
                      instance: ast.IdentifierExpression,
                      outputStr: 'name'
                    }),
                    type: utils.createNode({
                      instance: ast.LiteralKeywordExpression,
                      outputStr: 'string'
                    }),
                    optional: false,
                    rest: false
                  },
                  {
                    id: utils.createNode({
                      instance: ast.IdentifierExpression,
                      outputStr: 'age'
                    }),
                    type: utils.createNode({
                      instance: ast.LiteralKeywordExpression,
                      outputStr: 'number'
                    }),
                    optional: true,
                    rest: false
                  }
                ]
              }),
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                outputStr: 'string'
              }),
              outputStr: '(name: string, age?: number): string'
            })
          },
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.CallExpression,
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                outputStr: 'void'
              }),
              outputStr: '(): void'
            })
          },
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.CallExpression,
              outputStr: '()'
            })
          },
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.CallExpression,
              outputStr: '<T>()',
              genericArgs: utils.createNode({
                instance: ast.GenericArgsExpression,
                values: [
                  {
                    id: utils.createNode({
                      instance: ast.IdentifierExpression,
                      outputStr: 'T'
                    }),
                    default: void 0,
                    type: void 0
                  }
                ]
              })
            })
          }
        ]
      })
    }
  ];

  expressions.simple.constructor = [
    {
      content: `{ new (): void }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: 'new (): void', readonly: false }]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.ConstructorExpression,
              body: utils.createNode({
                instance: ast.Function.Mode.NormalExpression,
                return: utils.createNode({
                  instance: ast.Function.Return.Expression,
                  outputStr: 'void'
                })
              }),
              outputStr: 'new (): void'
            })
          }
        ]
      })
    },
    {
      content: `{ 
        new (name: string, age?: number):string,
        new ():void;
      }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          {
            text: 'new (name: string, age?: number): string',
            readonly: false
          },
          {
            text: 'new (): void',
            readonly: false
          }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.ConstructorExpression,
              body: utils.createNode({
                instance: ast.Function.Mode.NormalExpression,
                body: utils.createNode({
                  instance: ast.Function.Body.Expression,
                  args: [
                    {
                      id: utils.createNode({
                        instance: ast.IdentifierExpression,
                        outputStr: 'name'
                      }),
                      type: utils.createNode({
                        instance: ast.LiteralKeywordExpression,
                        outputStr: 'string'
                      }),
                      optional: false,
                      rest: false
                    },
                    {
                      id: utils.createNode({
                        instance: ast.IdentifierExpression,
                        outputStr: 'age'
                      }),
                      type: utils.createNode({
                        instance: ast.LiteralKeywordExpression,
                        outputStr: 'number'
                      }),
                      optional: true,
                      rest: false
                    }
                  ]
                }),
                return: utils.createNode({
                  instance: ast.Function.Return.Expression,
                  outputStr: 'string'
                })
              }),
              outputStr: 'new (name: string, age?: number): string'
            })
          },
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.ConstructorExpression,
              body: utils.createNode({
                instance: ast.Function.Mode.NormalExpression,
                return: utils.createNode({
                  instance: ast.Function.Return.Expression,
                  outputStr: 'void'
                })
              }),
              outputStr: 'new (): void'
            })
          }
        ]
      })
    }
  ];
  expressions.simple.method = [
    {
      content: `{ foo(): void }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: 'foo(): void', readonly: false }]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.MethodExpression,
              kind: SyntaxKind.E.ObjectMethod,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'foo'
              }),
              body: utils.createNode({
                instance: ast.Function.Mode.NormalExpression,
                return: utils.createNode({
                  instance: ast.Function.Return.Expression,
                  outputStr: 'void'
                })
              }),
              optional: false,
              outputStr: 'foo(): void'
            })
          }
        ]
      })
    },
    {
      content: `{ 
        foo(age?: number):any,
        bar?():void;
      }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: 'foo(age?: number): any', readonly: false },
          { text: 'bar?(): void', readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.MethodExpression,
              kind: SyntaxKind.E.ObjectMethod,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'foo'
              }),
              optional: false,
              body: utils.createNode({
                instance: ast.Function.Mode.NormalExpression,
                body: utils.createNode({
                  instance: ast.Function.Body.Expression,
                  args: [
                    {
                      id: utils.createNode({
                        instance: ast.IdentifierExpression,
                        outputStr: 'age'
                      }),
                      type: utils.createNode({
                        instance: ast.LiteralKeywordExpression,
                        outputStr: 'number'
                      }),
                      optional: true,
                      rest: false
                    }
                  ]
                }),
                return: utils.createNode({
                  instance: ast.Function.Return.Expression,
                  outputStr: 'any'
                })
              }),
              outputStr: 'foo(age?: number): any'
            })
          },
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.MethodExpression,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'bar'
              }),
              optional: true,
              body: utils.createNode({
                instance: ast.Function.Mode.NormalExpression,
                return: utils.createNode({
                  instance: ast.Function.Return.Expression,
                  outputStr: 'void'
                })
              }),
              outputStr: 'bar?(): void'
            })
          }
        ]
      })
    }
  ];

  expressions.simple.normal = [
    {
      content: `{ name: string }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: 'name: string', readonly: false }]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.NormalExpression,
            kind: SyntaxKind.E.ObjectNormal,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'name'
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              outputStr: 'string'
            }),
            optional: false,
            outputStr: 'name: string'
          })
        ]
      })
    },
    {
      content: `{ name: string, age?: number }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: 'name: string', readonly: false },
          { text: 'age?: number', readonly: false }
        ]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.NormalExpression,
            kind: SyntaxKind.E.ObjectNormal,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'name'
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              outputStr: 'string'
            }),
            optional: false,
            outputStr: 'name: string'
          }),
          utils.createNode({
            instance: ast.Object.Content.NormalExpression,
            kind: SyntaxKind.E.ObjectNormal,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'age'
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              outputStr: 'number'
            }),
            optional: true,
            outputStr: 'age?: number'
          })
        ]
      })
    }
  ];

  expressions.simple.literalIndex = [
    {
      content: "{ ['age']: number }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: "['age']: number", readonly: false }]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.LiteralIndexExpression,
              kind: SyntaxKind.E.ObjectLiteralIndex,
              literalName: utils.createNode({
                instance: ast.StringLiteralExpression,
                outputStr: "'age'"
              }),
              value: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                outputStr: 'number'
              }),
              optional: false,
              outputStr: "['age']: number"
            })
          }
        ]
      })
    },
    {
      content: "{ ['age']: number, [123]?: string }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: "['age']: number", readonly: false },
          { text: '[123]?: string', readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.LiteralIndexExpression,
              kind: SyntaxKind.E.ObjectLiteralIndex,
              literalName: utils.createNode({
                instance: ast.StringLiteralExpression,
                outputStr: "'age'"
              }),
              value: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                outputStr: 'number'
              }),
              optional: false,
              outputStr: "['age']: number"
            })
          },
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.LiteralIndexExpression,
              kind: SyntaxKind.E.ObjectLiteralIndex,
              literalName: utils.createNode({
                instance: ast.NumberLiteralExpression,
                outputStr: '123'
              }),
              value: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                outputStr: 'string'
              }),
              optional: true,
              outputStr: '[123]?: string'
            })
          }
        ]
      })
    }
  ];

  expressions.simple.indexSignature = [
    {
      content: '{ [key: string]: any }',
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: '[key: string]: any', readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.IndexSignatureExpression,
              kind: SyntaxKind.E.ObjectIndexSignature,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'key'
              }),
              nameType: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                outputStr: 'string'
              }),
              value: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                outputStr: 'any'
              }),
              outputStr: '[key: string]: any'
            })
          }
        ]
      })
    }
  ];

  expressions.simple.mapped = [
    {
      content: "{ [K in 'name' | 'age']: string }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: "[K in 'name' | 'age']: string", readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.MappedExpression,
              kind: SyntaxKind.E.ObjectMapped,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'K'
              }),
              inSource: utils.createNode({
                instance: ast.UnionExpression,
                kind: SyntaxKind.E.Union,
                outputStr: "'name' | 'age'",
                values: [
                  utils.createNode({
                    instance: ast.StringLiteralExpression,
                    outputStr: "'name'"
                  }),
                  utils.createNode({
                    instance: ast.StringLiteralExpression,
                    outputStr: "'age'"
                  })
                ]
              }),
              value: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                outputStr: 'string'
              }),
              outputStr: "[K in 'name' | 'age']: string",
              asTarget: false,
              operator: [false, false]
            })
          }
        ]
      })
    },
    {
      content: '{ [K in Union[number] as Filter<K>]?: Array<K> }',
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: '[K in Union[number] as Filter<K>]?: Array<K>', readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.MappedExpression,
              kind: SyntaxKind.E.ObjectMapped,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'K'
              }),
              inSource: utils.createNode({
                instance: ast.ElementAccessExpression,
                outputStr: 'Union[number]',
                source: utils.createNode({
                  instance: ast.TypeReferenceExpression,
                  outputStr: 'Union'
                }),
                key: utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  outputStr: 'number'
                })
              }),
              value: utils.createNode({
                instance: ast.TypeReferenceExpression,
                outputStr: 'Array<K>',
                name: utils.createNode({
                  instance: ast.IdentifierExpression,
                  outputStr: 'Array'
                })
              }),
              outputStr: '[K in Union[number] as Filter<K>]?: Array<K>',
              asTarget: utils.createNode({
                instance: ast.TypeReferenceExpression,
                outputStr: 'Filter<K>',
                name: utils.createNode({
                  instance: ast.IdentifierExpression,
                  outputStr: 'Filter'
                }),
                arguments: [
                  utils.createNode({
                    instance: ast.TypeReferenceExpression,
                    outputStr: 'K'
                  })
                ]
              }),
              operator: [false as any, true]
            })
          }
        ]
      })
    }
  ];
})();

(function initComplex() {
  expressions.complex.call = functionExpressions.normal.map(item => {
    return {
      content: `{ ${item.content} }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: item.node.outputStr!, readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: item.node
          }
        ]
      })
    };
  });

  expressions.complex.constructor = functionExpressions.normal.map(item => {
    return {
      content: `{ new ${item.content} }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([
          { text: 'new ' + item.node.outputStr!, readonly: false }
        ]),
        contents: [
          {
            readonly: false,
            value: utils.createNode({
              instance: ast.Object.Content.ConstructorExpression,
              body: item.node,
              outputStr: 'new ' + item.node.outputStr
            })
          }
        ]
      })
    };
  });

  expressions.complex.method = functionExpressions.normal.map(item => {
    const optional = _.random(0, 1) === 1;
    const readonly = _.random(0, 1) === 1;
    const operator = _.sample(['+', '-', ''])!;
    const id = _.sample(identifierTemplates)!;
    const content =
      '{ ' +
      (readonly ? operator + 'readonly ' : '') +
      id +
      (optional ? '?' : '') +
      item.content +
      ' }';
    const output = id + (optional ? '?' : '') + item.node.outputStr!;

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: output, readonly, operator }]),
        contents: [
          {
            operator: readonly ? operator || void 0 : void 0,
            readonly,
            value: utils.createNode({
              instance: ast.Object.Content.MethodExpression,
              kind: SyntaxKind.E.ObjectMethod,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: id
              }),
              optional,
              body: item.node,
              outputStr: output
            })
          }
        ]
      })
    };
  });

  const otherExpressions = [
    ..._.sampleSize(functionExpressions.arrow, 100),
    ..._.sampleSize(arrayExpressions, 100),
    ..._.sampleSize(bracketSurroundExpressions, 100),
    ..._.sampleSize(conditionExpressions.all, 100),
    ..._.sampleSize(elementAccessExpressions, 100),
    ..._.sampleSize(literalExpressions.all, 100),
    ..._.sampleSize(tupleExpressions, 100),
    ..._.sampleSize(unionExpressions.all, 100),
    ..._.sampleSize(intersectionExpressions.all, 100)
  ];

  expressions.complex.normal = otherExpressions.map(item => {
    const id = _.sample(identifierTemplates)!;
    const optional = _.random(0, 1) === 1;
    const readonly = _.random(0, 1) === 1;
    const operator = _.sample(['+', '-', ''])!;
    const content =
      '{ ' +
      (readonly ? operator + 'readonly ' : '') +
      id +
      (optional ? '?' : '') +
      ': ' +
      item.content +
      ' }';
    const output = id + (optional ? '?' : '') + ': ' + item.node.outputStr!;

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: output, readonly, operator }]),
        contents: [
          {
            operator: readonly ? operator || void 0 : void 0,
            readonly,
            value: utils.createNode({
              instance: ast.Object.Content.NormalExpression,
              kind: SyntaxKind.E.ObjectNormal,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: id
              }),
              optional,
              value: item.node,
              outputStr: output
            })
          }
        ]
      })
    };
  });

  expressions.complex.literalIndex = _.sampleSize(
    [...literalExpressions.number, ...literalExpressions.string],
    100
  ).map(literalName => {
    const value = _.sample(otherExpressions)!;
    const optional = _.random(0, 1) === 1;
    const readonly = _.random(0, 1) === 1;
    const content = `{ ${readonly ? 'readonly ' : ''}[${literalName.content}]${
      optional ? '?' : ''
    }: ${value.content} }`;
    const output = `[${literalName.node.outputStr}]${optional ? '?' : ''}: ${
      value.node.outputStr
    }`;

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: output, readonly }]),
        contents: [
          {
            readonly,
            value: utils.createNode({
              instance: ast.Object.Content.LiteralIndexExpression,
              kind: SyntaxKind.E.ObjectLiteralIndex,
              literalName: literalName.node,
              optional,
              value: value.node,
              outputStr: output
            })
          }
        ]
      })
    };
  });

  expressions.complex.indexSignature = _.sampleSize(otherExpressions, 100).map(
    nameType => {
      const id = _.sample(identifierTemplates)!;
      const value = _.sample(otherExpressions)!;
      const readonly = _.random(0, 1) === 1;
      const content = `{ ${readonly ? 'readonly ' : ''}[${id}: ${nameType.content}]: ${
        value.content
      } }`;
      const output = `[${id}: ${nameType.node.outputStr}]: ${value.node.outputStr}`;

      return {
        content,
        node: utils.createNode({
          instance: ast.Object.Expression,
          kind: SyntaxKind.E.Object,
          outputStr: generateObjectOutput([{ text: output, readonly }]),
          contents: [
            {
              readonly,
              value: utils.createNode({
                instance: ast.Object.Content.IndexSignatureExpression,
                kind: SyntaxKind.E.ObjectIndexSignature,
                value: value.node,
                name: utils.createNode({
                  instance: ast.IdentifierExpression,
                  outputStr: id
                }),
                nameType: nameType.node,
                outputStr: output
              })
            }
          ]
        })
      };
    }
  );

  expressions.complex.mapped = otherExpressions.map(value => {
    const id = _.sample(identifierTemplates)!;
    const operator = {
      remove: _.random(0, 1) === 1,
      optional: _.random(0, 1) === 1
    };
    const readonly = _.random(0, 1) === 1;
    const inSource = _.sample(otherExpressions)!;
    const asTarget = _.random(0, 1) === 1 ? _.sample(otherExpressions)! : false;

    const content = utils.mergeString(
      '{ ',
      readonly ? 'readonly ' : '',
      '[',
      id,
      ' in ',
      inSource.content,
      asTarget ? ' as ' + asTarget.content : '',
      ']',
      operator.remove ? ' -?' : operator.optional ? '?' : '',
      ': ',
      value.content,
      ' }'
    );

    const output = utils.mergeString(
      '[',
      id,
      ' in ',
      inSource.node.outputStr!,
      asTarget ? ' as ' + asTarget.node.outputStr : '',
      ']',
      operator.remove ? '-?' : operator.optional ? '?' : '',
      ': ',
      value.node.outputStr!
    );

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: SyntaxKind.E.Object,
        outputStr: generateObjectOutput([{ text: output, readonly }]),
        contents: [
          {
            readonly,
            value: utils.createNode({
              instance: ast.Object.Content.MappedExpression,
              kind: SyntaxKind.E.ObjectMapped,
              value: value.node,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: id
              }),
              inSource: inSource.node,
              asTarget: asTarget ? asTarget.node : false,
              operator: operator.remove
                ? [true, true]
                : ([false, operator.optional] as any),
              outputStr: output
            })
          }
        ]
      })
    };
  });
})();

expressions.all = [
  ..._.values(expressions.simple).flat(Infinity),
  ..._.values(expressions.complex).flat(Infinity)
] as any;
