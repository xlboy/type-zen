import { returnComponents } from "./return";
import { bodyComponents } from "./body";
import { arrowComponents } from "./arrow";
import { normalComponents } from "./normal";
import { constructorComponents } from "./constructor";

export { components as functionComponents };

const components = {
  return: returnComponents,
  body: bodyComponents,
  arrow: arrowComponents,
  normal: normalComponents,
  constructor: constructorComponents,
};
