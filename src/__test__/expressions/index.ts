import { TestNode } from "../utils";
import { identifierTemplates } from "./identifier";
import { literalExpressions } from "./literal";
import { typeReferenceExpressions } from "./type-reference";
import { unionExpressions } from "./union";
import { tupleExpressions } from "./tuple";
import { getKeyValueExpressions } from "./get-key-value";
import { genericArgsExpressions } from "./generic-args";
import { bracketSurroundExpressions } from "./bracket-surround";
import { conditionExpressions, inferExpressions } from "./condition";
import { arrayExpressions } from "./array";
import { functionExpressions } from "./function";
import { objectExpressions } from "./object";

export { type Expression };
export {
  identifierTemplates,
  literalExpressions,
  typeReferenceExpressions,
  unionExpressions,
  tupleExpressions,
  getKeyValueExpressions,
  genericArgsExpressions,
  bracketSurroundExpressions,
  conditionExpressions,
  inferExpressions,
  arrayExpressions,
  functionExpressions,
  objectExpressions,
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
  ...arrayExpressions,
  ...functionExpressions.arrow,
];
