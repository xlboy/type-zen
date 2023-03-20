import type { TestNode } from '../utils';
import { arrayExpressions } from './array';
import { bracketSurroundExpressions } from './bracket-surround';
import { conditionExpressions, inferExpressions } from './condition';
import { elementAccessExpressions } from './element-access';
import { functionExpressions } from './function';
import { genericArgsExpressions } from './generic-args';
import { identifierTemplates } from './identifier';
import { intersectionExpressions } from './intersection';
import { keyofExpressions } from './keyof';
import { literalExpressions } from './literal';
import { objectExpressions } from './object';
import { propertyAccessExpressions } from './property-access';
import { sugarBlockExpressions } from './sugar-block';
import { templateStringExpressions } from './template-string';
import { tupleExpressions } from './tuple';
import { typeReferenceExpressions } from './type-reference';
import { unionExpressions } from './union';

export { type Expression };
export {
  identifierTemplates,
  literalExpressions,
  typeReferenceExpressions,
  unionExpressions,
  intersectionExpressions,
  tupleExpressions,
  elementAccessExpressions,
  propertyAccessExpressions,
  genericArgsExpressions,
  bracketSurroundExpressions,
  conditionExpressions,
  inferExpressions,
  arrayExpressions,
  functionExpressions,
  objectExpressions,
  keyofExpressions,
  sugarBlockExpressions,
  templateStringExpressions,
  mainExpressions
};

interface Expression {
  content: string;
  node: TestNode;
}

const mainExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ...tupleExpressions,
  ...elementAccessExpressions,
  ...bracketSurroundExpressions,
  ...conditionExpressions.all,
  ...inferExpressions.all,
  ...unionExpressions.all,
  ...intersectionExpressions.all,
  ...arrayExpressions,
  ...functionExpressions.arrow,
  ...objectExpressions.all,
  ...keyofExpressions,
  ...sugarBlockExpressions.simple
];
