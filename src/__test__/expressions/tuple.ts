import _ from 'lodash-es';
import * as ast from '../../ast';
import * as utils from '../utils';
import { literalExpressions } from './literal';
import { typeReferenceExpressions } from './type-reference';
import { Expression } from './';
import { unionExpressions } from './union';
import { identifierTemplates } from './identifier';
import { SyntaxKind } from '../../ast/constants';

export { expressions as tupleExpressions };

const permutedExpressionGroup = utils.permuteObjects(
  [
    ...literalExpressions.all,
    ..._.sampleSize(unionExpressions.all, 100),
    ...typeReferenceExpressions
  ],
  1,
  2
);

const expressions: Expression[] = [];

for (const pExpressions of permutedExpressionGroup) {
  type Value = NonNullable<utils.TestNode<ast.TupleExpression>['values']>[number];
  const values: Value[] = [];
  let output = '[',
    content = '[';
  for (let index = 0; index < pExpressions.length; index++) {
    const id = _.random(0, 1) === 1 ? _.sample(identifierTemplates)! : null;
    const deconstruction = _.random(0, 1) === 1;
    const optional = _.random(0, 1) === 1;

    //#region  //*=========== item ===========
    const item: Value = { deconstruction };
    item.id = id
      ? utils.createNode({
          instance: ast.IdentifierExpression,
          output: id
        })
      : false;
    item.type = pExpressions[index].node;
    item.optional = deconstruction ? false : optional;

    values.push(item);
    //#endregion  //*======== item ===========

    //#region  //*=========== output, content ===========
    if (deconstruction) {
      output += '...';
      content += '...';
    }

    if (id) {
      output += id;
      content += id;

      if (optional && !deconstruction) {
        output += '?';
        content += '?';
      }

      output += ': ';
      content += ': ';
    }

    output += pExpressions[index].node.output;
    content += pExpressions[index].content;

    if (!id && !deconstruction && optional) {
      output += '?';
      content += '?';
    }

    if (index !== pExpressions.length - 1) {
      output += ', ';
      content += ', ';
    } else {
      const trailingComma = _.random(0, 1) === 1;
      if (trailingComma) content += ',';
    }
    //#endregion  //*======== output, content ===========
  }

  output += ']';
  content += ']';
  expressions.push({
    content,
    node: utils.createNode({
      instance: ast.TupleExpression,
      kind: SyntaxKind.E.Tuple,
      output,
      values
    })
  });
}
