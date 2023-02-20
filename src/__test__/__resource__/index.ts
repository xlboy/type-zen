export { Literal } from "./syntax/expressions/literal";
export { Union } from "./syntax/expressions/union";
export { BracketSurround } from "./syntax/expressions/bracket-surround";
export { Identifier } from "./syntax/expressions/identifier";
export { Condition } from "./syntax/expressions/condition";
export { TypeDeclarationArgs } from "./syntax/expressions/type-declaration-args";

import { assertSource } from "./utils";

export const utils = {
  assertSource,
};
