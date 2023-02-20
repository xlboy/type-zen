import { describe, expect, it } from "vitest";
import { NearleyError, Parser } from "../../api/parser";
import * as resource from "../__resource__";

describe("number", () => {
  it("error throw: UnexpectedInput", () => {
    for (const num of resource.Literal.template.number.invalid) {
      const fn = () => new Parser(`type b = ${num};`).toAST();
      expect(fn).throw();

      try {
        fn();
      } catch (error) {
        expect(error).instanceOf(NearleyError.UnexpectedInput);
      }
    }
  });

  it("nodes", () => {
    resource.Literal.nodes.number.forEach((node) => {
      resource.utils.assertSource(node);
    });
  });
});

describe("string", () => {
    it("error throw: UnexpectedInput", () => {
      for (const str of resource.Literal.template.string.invalid) {
        const fn = () => new Parser(`type str = ${str};`).toAST();
        expect(fn).throw();
  
        try {
          fn();
        } catch (error) {
          expect(error).instanceOf(NearleyError.UnexpectedInput);
        }
      }
    });
  
    it("nodes", () => {
      resource.Literal.nodes.string.forEach((node) => {
        resource.utils.assertSource(node);
      });
    });
  });