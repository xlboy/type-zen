import { it } from "vitest";
import * as resource from "../__resource__";

it("nodes", () => {
  resource.GetKeyValue.nodes.forEach((node) => {
    resource.utils.assertSource(node);
  });
});
