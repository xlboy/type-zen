import { arrowExpressions } from './arrow';
import { bodyExpressions } from './body';
import { constructorExpressions } from './constructor';
import { normalExpressions } from './normal';
import { returnExpressions } from './return';

export { expressions as functionExpressions };

const expressions = {
  return: returnExpressions,
  body: bodyExpressions,
  arrow: arrowExpressions,
  normal: normalExpressions,
  constructor: constructorExpressions
};
