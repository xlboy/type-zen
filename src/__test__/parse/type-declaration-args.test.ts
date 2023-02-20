import { describe, it } from "vitest";
import * as resource from "../__resource__";

describe("extended", () => {
  it("nodes", () => {
    resource.TypeDeclarationArgs.nodes.extended.forEach((node) => {
      resource.utils.assertSource(node);
    });
  });
});

// describe("extended", () => {
//   it("nodes", () => {
//     resource.Union.nodes.extended.forEach((node) => {
//       resource.utils.assertSource(node);
//     });
//   });
// });
