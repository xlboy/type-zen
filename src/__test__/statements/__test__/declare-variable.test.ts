import { it } from "vitest";
import { declareVariableStatements } from "..";
import * as utils from "../../utils";

it("normal", () => {
  declareVariableStatements.forEach((stmt) => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node],
    });
  });
});
