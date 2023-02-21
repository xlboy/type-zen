import { it } from "vitest";
import * as resource from "../__resource__";

it("nodes", () => {
  resource.TypeReference.nodes.forEach((node) => {
    resource.utils.assertSource(node);
  });
});
