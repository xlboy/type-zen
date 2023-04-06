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
      outputStr: '(1)'
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
          name: utils.createNode({ instance: ast.IdentifierExpression, outputStr: 'a' }),
          value: utils.createNode({
            instance: ast.NumberLiteralExpression,
            outputStr: '1'
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockReturnExpression,
          body: utils.createNode({
            instance: ast.TupleExpression,
            outputStr: '[a]'
          }),
          outputStr: '[a]'
        })
      ],
      outputStr: '([1] extends [infer a] ? [a] : never)'
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
            outputStr: 'A'
          }),
          value: utils.createNode({
            instance: ast.UnionExpression,
            outputStr: '1 | 2 | 3'
          })
        }),
        utils.createNode({
          instance: ast.TypeAliasStatement,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            outputStr: 'B'
          }),
          value: utils.createNode({
            instance: ast.IntersectionExpression,
            outputStr: 'AA & BB & CC'
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockReturnExpression,
          body: utils.createNode({
            instance: ast.UnionExpression,
            outputStr: 'A | "and" | B'
          }),
          outputStr: 'A | "and" | B'
        })
      ],
      outputStr: `([1 | 2 | 3, AA & BB & CC] extends [infer A, infer B] ? A | "and" | B : never)`
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
            outputStr: 'B'
          }),
          value: utils.createNode({
            instance: ast.NumberLiteralExpression,
            outputStr: '3'
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockIfExpression,
          condition: {
            left: utils.createNode({
              instance: ast.TypeReferenceExpression,
              outputStr: 'B'
            }) as any,
            right: utils.createNode({
              instance: ast.NumberLiteralExpression,
              outputStr: '3'
            }) as any
          },
          then: utils.createNode({
            instance: ast.SugarBlockExpression,
            outputStr: '(1)'
          }),
          else: utils.createNode({
            instance: ast.SugarBlockIfExpression,
            condition: {
              left: utils.createNode({
                instance: ast.TypeReferenceExpression,
                outputStr: 'B'
              }) as any,
              right: utils.createNode({
                instance: ast.NumberLiteralExpression,
                outputStr: '4'
              }) as any
            },
            then: utils.createNode({
              instance: ast.SugarBlockExpression,
              statements: [
                utils.createNode({
                  instance: ast.TypeAliasStatement,
                  name: utils.createNode({
                    instance: ast.IdentifierExpression,
                    outputStr: 'C'
                  }),
                  value: utils.createNode({
                    instance: ast.StringLiteralExpression,
                    outputStr: `'sdfsfd'`
                  })
                }),
                utils.createNode({
                  instance: ast.SugarBlockIfExpression,
                  condition: {
                    left: utils.createNode({
                      instance: ast.TypeReferenceExpression,
                      outputStr: 'C'
                    }) as any,
                    right: utils.createNode({
                      instance: ast.StringLiteralExpression,
                      outputStr: `'sss'`
                    }) as any
                  },
                  then: utils.createNode({
                    instance: ast.SugarBlockExpression,
                    outputStr: `('ssss')`
                  })
                }),
                utils.createNode({
                  instance: ast.SugarBlockReturnExpression,
                  body: utils.createNode({
                    instance: ast.NumberLiteralExpression,
                    outputStr: '2'
                  }),
                  outputStr: '2'
                })
              ]
            })
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockReturnExpression,
          body: utils.createNode({
            instance: ast.UnionExpression,
            outputStr: '3 | 4'
          }),
          outputStr: '3 | 4'
        })
      ],
      outputReg: new RegExp(
        `\\(\\[3\\] extends \\[infer B\\] \\? \\(B extends 3 \\? \\(1\\) : B extends 4 \\? \\(\\['sdfsfd'\\] extends \\[infer C\\] \\? \\(C extends 'sss' \\? \\('ssss'\\) : TZ_URS\\) extends infer r_.+? \\? r_.+? extends TZ_URS \\? 2 : r_.+? : never : never\\) : TZ_URS\\) extends infer r_.+? \\? r_.+? extends TZ_URS \\? 3 | 4 : r_.+? : never : never\\)`
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
            outputStr: 'B'
          }),
          value: utils.createNode({
            instance: ast.StringLiteralExpression,
            outputStr: `'->>>>'`
          })
        }),
        utils.createNode({
          instance: ast.SugarBlockForExpression,
          mapping: {
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'Item'
            }) as any,
            source: utils.createNode({
              instance: ast.TypeReferenceExpression,
              outputStr: 'Union'
            }) as any
          },
          body: utils.createNode({
            instance: ast.SugarBlockExpression,
            statements: [
              utils.createNode({
                instance: ast.SugarBlockReturnExpression,
                body: utils.createNode({
                  instance: ast.TupleExpression,
                  outputStr: '[B, Item]'
                })
              })
            ]
          })
        })
      ],
      outputStr: `(['->>>>'] extends [infer B] ? Union extends infer Item ? ([B, Item]) : never : never)`
    })
  });
})();
