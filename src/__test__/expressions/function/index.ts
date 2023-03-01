import { returnExpressions } from "./return";
import { bodyExpressions } from "./body";
import { arrowExpressions } from "./arrow";
import { normalExpressions } from "./normal";
import { constructorExpressions } from "./constructor";

export { expressions as functionExpressions };

const expressions = {
  return: returnExpressions,
  body: bodyExpressions,
  arrow: arrowExpressions,
  normal: normalExpressions,
  constructor: constructorExpressions,
};
