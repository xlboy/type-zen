import * as ast from "../../ast";
import * as utils from "../utils";
import { identifierTemplates } from "./identifier";
import { Component } from "./types";

export { components as typeReferenceComponents };

const components: Component[] = (() => {
  const templates = [
    "Array",
    "Partial",
    "Readonly",
    "Record",
    "Required",
    "ReturnType",
    ...identifierTemplates,
  ];

  return templates.map((template) => ({
    content: template,
    node: utils.createNode({
      instance: ast.TypeReferenceExpression,
      output: template,
      kind: ast.Type.SyntaxKind.E.TypeReference,
      identifier: utils.createNode({
        instance: ast.IdentifierExpression,
        output: template,
      }),
      arguments: [],
    }),
  }));
})();
