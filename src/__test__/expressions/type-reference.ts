import * as ast from "../../ast";
import * as utils from "../utils";
import { identifierTemplates } from "./identifier";
import { Expression } from "./";

export { expressions as typeReferenceExpressions };

const expressions: Expression[] = (() => {
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
      name: utils.createNode({
        instance: ast.IdentifierExpression,
        output: template,
      }),
      arguments: [],
    }),
  }));
})();
