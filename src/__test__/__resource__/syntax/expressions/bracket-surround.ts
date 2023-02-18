import { identifierTemplate } from "./identifier";
import { literalTemplate } from "./literal";
export { bracketSurroundTemaplte };

function wrapper(template: string[]) {
  return template.map((item) => `(${item})`);
}

const bracketSurroundTemaplte = {
  valid: {
    identifier: wrapper(identifierTemplate.valid),
    literal: {
      number: wrapper(literalTemplate.number.valid),
      string: wrapper(literalTemplate.string.valid),
    },
  },
};
