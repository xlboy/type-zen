import { describe, it, expect } from "vitest";
import * as resource from "../__resource__";
import { NearleyError, Parser } from "../../api/parser";

describe("valid", () => {
  it("nodes", () => {
    resource.Identifier.nodes.forEach((node) => {
      resource.utils.assertSource(node);
    });
  });
});

it("invalid", () => {
  it("error throw: UnexpectedInput", () => {
    for (const id of resource.Identifier.template.invalid) {
      const fn = () => new Parser(`type ${id} = 1;`).toAST();
      expect(fn).throw();

      try {
        fn();
      } catch (error) {
        expect(error).instanceOf(NearleyError.UnexpectedInput);
      }
    }
  });
});
