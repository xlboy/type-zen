import { it } from "vitest";
import * as resource from "../__resource__";

it("nodes", () => {
  resource.Tuple.nodes.forEach((node) => {
    resource.utils.assertSource(node);
  });
});
