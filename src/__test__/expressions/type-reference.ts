import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from './';
import { identifierTemplates } from './identifier';

export { expressions as typeReferenceExpressions };

const expressions: Expression[] = (() => {
  const templates = [
    'Array',
    'Partial',
    'Readonly',
    'Record',
    'Required',
    'ReturnType',
    ...identifierTemplates
  ];

  return templates.map(template => ({
    content: template,
    node: utils.createNode({
      instance: ast.TypeReferenceExpression,
      output: template,
      kind: SyntaxKind.E.TypeReference,
      name: utils.createNode({
        instance: ast.IdentifierExpression,
        output: template
      }),
      arguments: []
    })
  }));
})();
