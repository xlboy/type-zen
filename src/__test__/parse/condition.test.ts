import { describe, it } from "vitest";
import * as resource from "../__resource__";

describe("native", () => {
  it("nodes", () => {
    resource.Condition.nodes.native.forEach((node) => {
      resource.utils.assertSource(node);
    });
  });
});

describe("extended", () => {
  it("nodes", () => {
    resource.Condition.nodes.extended.forEach((node) => {
      resource.utils.assertSource(node);
    });
  });
});
