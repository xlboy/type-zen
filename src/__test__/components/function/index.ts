import { returnComponents } from "./return";
import { bodyComponents } from "./body";
import { arrowComponents } from "./arrow";
import { constructorComponents } from "./constructor";

export { components as functionComponents };

const components = {
  return: returnComponents,
  body: bodyComponents,
  arrow: arrowComponents,
  constructor: constructorComponents,
};
