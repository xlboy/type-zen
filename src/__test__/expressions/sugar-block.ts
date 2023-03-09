import * as ast from '../../ast';
import { SyntaxKind } from '../../ast';
import * as utils from '../utils';
import type { Expression } from '.';

export { expressions as sugarBlockExpressions };

const expressions: Record<'simple' | 'complex', Expression[]> = {
  simple: [],
  complex: []
};

(function initSimple() {
  expressions.simple.push({
    content: `^{ return 1; }`,
    node: utils.createNode({
      instance: ast.SugarBlockExpression,
      kind: SyntaxKind.E.SugarBlock,
      output: '1'
    })
  });

  expressions.simple.push({
    content: `^{
      type a = 1;

      return [a];
     }`,
    node: utils.createNode({
      instance: ast.SugarBlockExpression,
      kind: SyntaxKind.E.SugarBlock,
      statements: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          name: utils.createNode({ instance: ast.IdentifierExpression, output: 'a' }),
          value: utils.createNode({ instance: ast.NumberLiteralExpression, output: '1' })
        }),
        utils.createNode({
          instance: ast.SugarBlockReturnExpression,
          body: utils.createNode({
            instance: ast.TupleExpression,
            output: '[a]'
          }),
          output: '[a]'
        })
      ],
      output: '[1] extends [infer a] ? [a] : never'
    })
  });

  expressions.simple.push({
    content: `
      ^{
        type A = | [1, 2, 3];
        type B = & [AA, BB, CC]

        return | [A, "and", B];
      }
    `,
    node: utils.createNode({
      instance: ast.SugarBlockExpression,
      statements: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            output: 'A'
          }),
          value: utils.createNode({
            instance: ast.UnionExpression,
            output: '1 | 2 | 3'
          })
        }),
        utils.createNode({
          instance: ast.TypeAliasStatement,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            output: 'B'
          }),
          value: utils.createNode({
            instance: ast.IntersectionExpression,
            output: 'AA & BB & CC'
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockReturnExpression,
          body: utils.createNode({
            instance: ast.UnionExpression,
            output: 'A | "and" | B'
          }),
          output: 'A | "and" | B'
        })
      ],
      output: `[1 | 2 | 3, AA & BB & CC] extends [infer A, infer B] ? A | "and" | B : never`
    })
  });

  // if
  expressions.simple.push({
    content: `
      ^{
        type B = 3;

        if (B == 3) {
          return 1;
        } else if (B == 4) {
          type C = 'sdfsfd';

          if (C == 'sss') {
            return 'ssss'
          }

          return 2;
        }
        
        return 3 | 4;
      }
      `,
    node: utils.createNode({
      instance: ast.SugarBlockExpression,
      statements: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            output: 'B'
          }),
          value: utils.createNode({
            instance: ast.NumberLiteralExpression,
            output: '3'
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockIfExpression,
          condition: {
            left: utils.createNode({
              instance: ast.TypeReferenceExpression,
              output: 'B'
            }) as any,
            right: utils.createNode({
              instance: ast.NumberLiteralExpression,
              output: '3'
            }) as any
          },
          then: utils.createNode({
            instance: ast.SugarBlockExpression,
            output: '1'
          }),
          else: utils.createNode({
            instance: ast.SugarBlockIfExpression,
            condition: {
              left: utils.createNode({
                instance: ast.TypeReferenceExpression,
                output: 'B'
              }) as any,
              right: utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: '4'
              }) as any
            },
            then: utils.createNode({
              instance: ast.SugarBlockExpression,
              statements: [
                utils.createNode({
                  instance: ast.TypeAliasStatement,
                  name: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: 'C'
                  }),
                  value: utils.createNode({
                    instance: ast.StringLiteralExpression,
                    output: `'sdfsfd'`
                  })
                }),
                utils.createNode({
                  instance: ast.SugarBlockIfExpression,
                  condition: {
                    left: utils.createNode({
                      instance: ast.TypeReferenceExpression,
                      output: 'C'
                    }) as any,
                    right: utils.createNode({
                      instance: ast.StringLiteralExpression,
                      output: `'sss'`
                    }) as any
                  },
                  then: utils.createNode({
                    instance: ast.SugarBlockExpression,
                    output: `'ssss'`
                  })
                }),
                utils.createNode({
                  instance: ast.SugarBlockReturnExpression,
                  body: utils.createNode({
                    instance: ast.NumberLiteralExpression,
                    output: '2'
                  }),
                  output: '2'
                })
              ]
            })
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockReturnExpression,
          body: utils.createNode({
            instance: ast.UnionExpression,
            output: '3 | 4'
          }),
          output: '3 | 4'
        })
      ],
      output: new RegExp(
        `\\[3\\] extends \\[infer B\\] \\? \\(B extends 3 \\? 1 : B extends 4 \\? \\['sdfsfd'\\] extends \\[infer C\\] \\? \\(C extends 'sss' \\? 'ssss' : UnreturnedSymbol\\) extends infer r_.+? \\? r_.+? extends UnreturnedSymbol \\? 2 : r_.+? : never : never : UnreturnedSymbol\\) extends infer r_.+? \\? r_.+? extends UnreturnedSymbol \\? 3 \\| 4 : r_.+? : never : never`
      )
    })
  });

  // for
  expressions.simple.push({
    content: `
      ^{
        type B = '->>>>';
        
        for (infer Item in Union) {
          return [B, Item]
        }
        
      }`,
    node: utils.createNode({
      instance: ast.SugarBlockExpression,
      statements: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            output: 'B'
          }),
          value: utils.createNode({
            instance: ast.StringLiteralExpression,
            output: `'->>>>'`
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockForExpression,
          mapping: {
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: 'Item'
            }) as any,
            source: utils.createNode({
              instance: ast.TypeReferenceExpression,
              output: 'Union'
            }) as any
          },
          body: utils.createNode({
            instance: ast.SugarBlockExpression,
            statements: [
              utils.createNode({
                instance: ast.SugarBlockReturnExpression,
                body: utils.createNode({
                  instance: ast.TupleExpression,
                  output: '[B, Item]'
                })
              })
            ]
          })
        })
      ],
      output: `['->>>>'] extends [infer B] ? Union extends infer Item ? [B, Item] : never : never`
    })
  });
})();
