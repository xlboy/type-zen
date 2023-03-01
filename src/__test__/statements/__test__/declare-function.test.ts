import { it } from "vitest";
import { declareFunctionStatements } from "..";
import * as utils from "../../utils";

it("normal", () => {
  declareFunctionStatements.forEach((stmt) => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node],
    });
  });
});
