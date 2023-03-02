import { TestNode } from "../utils";
import { identifierTemplates } from "./identifier";
import { literalExpressions } from "./literal";
import { typeReferenceExpressions } from "./type-reference";
import { unionExpressions } from "./union";
import { intersectionExpressions } from "./intersection";
import { tupleExpressions } from "./tuple";
import { getKeyValueExpressions } from "./get-key-value";
import { genericArgsExpressions } from "./generic-args";
import { bracketSurroundExpressions } from "./bracket-surround";
import { conditionExpressions, inferExpressions } from "./condition";
import { arrayExpressions } from "./array";
import { functionExpressions } from "./function";
import { objectExpressions } from "./object";
import { keyofExpressions } from "./keyof";

export { type Expression };
export {
  identifierTemplates,
  literalExpressions,
  typeReferenceExpressions,
  unionExpressions,
  intersectionExpressions,
  tupleExpressions,
  getKeyValueExpressions,
  genericArgsExpressions,
  bracketSurroundExpressions,
  conditionExpressions,
  inferExpressions,
  arrayExpressions,
  functionExpressions,
  objectExpressions,
  keyofExpressions,
  mainExpressions,
};

interface Expression {
  content: string;
  node: TestNode;
}

const mainExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ...tupleExpressions,
  ...getKeyValueExpressions,
  ...bracketSurroundExpressions,
  ...conditionExpressions.all,
  ...inferExpressions.all,
  ...unionExpressions.all,
  ...intersectionExpressions.all,
  ...arrayExpressions,
  ...functionExpressions.arrow,
  ...objectExpressions.all,
  ...keyofExpressions,
];
