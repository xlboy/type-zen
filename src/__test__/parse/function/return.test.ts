import { it } from "vitest";
import * as resource from "../../__resource__";

it("assertAndIs", () => {
  resource.Function.Return.nodes.assertAndIs.forEach((node) => {
    resource.utils.assertSource(node);
  });
});

it("isOnly", () => {
  resource.Function.Return.nodes.isOnly.forEach((node) => {
    resource.utils.assertSource(node);
  });
});

it("normal", () => {
  resource.Function.Return.nodes.normal.forEach((node) => {
    resource.utils.assertSource(node);
  });
});
