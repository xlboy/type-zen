import { it } from "vitest";
import * as resource from "../../__resource__";

it("case-1", () => {
  resource.Function.Arrow.nodes.forEach((node) => {
    resource.utils.assertSource(node);
  });
});
