import { describe, it } from "vitest";
import * as resource from "../__resource__";

describe("native", () => {
  it("nodes", () => {
    resource.Union.nodes.native.forEach((node) => {
      resource.utils.assertSource(node);
    });
  });
});

describe("extended", () => {
  it("nodes", () => {
    resource.Union.nodes.extended.forEach((node) => {
      resource.utils.assertSource(node);
    });
  });
});
