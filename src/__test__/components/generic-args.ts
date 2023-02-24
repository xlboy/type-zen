import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { identifierTemplates } from "./identifier";
import { literalComponents } from "./literal";
import { typeReferenceComponents } from "./type-reference";
import type { Component } from "./types";
import { unionComponents } from "./union";

export { components as genericArgsComponents };

const components: Record<"native" | "extended", Component[]> = {
  native: [],
  extended: [],
};

const permutedIdGroup = utils.permuteObjects(identifierTemplates, 1, 3);

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ...unionComponents.all.slice(0, 100),
];

let i = 0;
permutedIdGroup.forEach((ids) => {
  const args: Partial<
    Record<keyof ast.GenericArgsExpression["values"][number], utils.TestNode>
  >[] = [];

  ids.forEach((id) => {
    args.push({
      id: utils.createNode({
        instance: ast.IdentifierExpression,
        output: id,
      }),
      ...(i === 0
        ? {
            default: _.sample(otherComponents)!.node,
          }
        : i === 1
        ? {
            type: _.sample(otherComponents)!.node,
          }
        : {
            default: _.sample(otherComponents)!.node,
            type: _.sample(otherComponents)!.node,
          }),
    });
    i++;
    if (i === 3) i = 0;
  });

  const generateContent = (isNative: boolean) => {
    return utils.mergeString(
      "<",
      args
        .map((arg) => {
          let str = arg.id!.output;
          if (arg.type)
            str += ` ${isNative ? "extends" : ":"} ${arg.type.output}`;
          if (arg.default) str += ` = ${arg.default.output}`;

          return str;
        })
        .join(", "),
      ">"
    );
  };

  components.native.push({
    content: generateContent(true),
    node: utils.createNode({
      instance: ast.GenericArgsExpression,
      output: generateContent(true),
      kind: ast.Type.SyntaxKind.E.GenericArgs,
      values: args,
    }),
  });

  components.extended.push({
    content: generateContent(false),
    node: utils.createNode({
      instance: ast.GenericArgsExpression,
      output: generateContent(true),
      kind: ast.Type.SyntaxKind.E.GenericArgs,
      values: args,
    }),
  });
});
