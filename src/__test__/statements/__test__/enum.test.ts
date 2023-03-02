import { it } from "vitest";
import { enumStatements } from "..";
import * as utils from "../../utils";

it("normal", () => {
  enumStatements.forEach((stmt) => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node],
    });
  });
});
