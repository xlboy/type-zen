import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { bracketSurroundComponents } from "./bracket-surround";
import { getKeyValueComponents } from "./get-key-value";
import { literalComponents } from "./literal";
import { tupleComponents } from "./tuple";
import { typeReferenceComponents } from "./type-reference";
import { Component } from "./types";
import { unionComponents } from "./union";
import { identifierTemplates } from "./identifier";
export { conditionComponents, inferComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ..._.sampleSize(unionComponents.all, 5000),
  ..._.sampleSize(tupleComponents, 5000),
  ..._.sampleSize(getKeyValueComponents, 5000),
  ...bracketSurroundComponents,
];

const inferComponents: Record<"extended" | "native" | "all", Component[]> =
  (() => {
    const inferComponents: Record<"extended" | "native" | "all", Component[]> =
      {
        extended: [],
        native: [],
        all: [],
      };

    for (let i = 0; i < 1000; i++) {
      const id = utils.createNode({
        instance: ast.IdentifierExpression,
        output: _.sample(identifierTemplates)!,
      });
      const extendsTypes: utils.TestNode<ast.Base>[] = [];
      const hasExtendsTypes = _.random(0, 1) === 1;

      let native = {
        content: id.output!,
        output: id.output!,
      };
      let extended = {
        content: id.output!,
        output: id.output!,
      };

      if (hasExtendsTypes) {
        const extendsSize = _.random(1, 3);
        _.sampleSize(otherComponents, extendsSize).forEach((item) => {
          extendsTypes.push(item.node);

          native.content += ` extends ${item.content}`;
          native.output += ` extends ${item.node.output}`;
          extended.content += ` == ${item.content}`;
          extended.output += ` extends ${item.node.output}`;
        });
      }

      inferComponents.native.push({
        content: `infer ${native.content}`,
        node: utils.createNode({
          instance: ast.InferExpression,
          kind: ast.Type.SyntaxKind.E.Infer,
          output: `infer ${native.output}`,
          name: id,
          extendsTypes,
        }),
      });

      inferComponents.extended.push({
        content: `infer ${extended.content}`,
        node: utils.createNode({
          instance: ast.InferExpression,
          kind: ast.Type.SyntaxKind.E.Infer,
          output: `infer ${extended.output}`,
          name: id,
          extendsTypes,
        }),
      });
    }

    inferComponents.all = [
      ...inferComponents.native,
      ...inferComponents.extended,
    ];

    return inferComponents;
  })();

const conditionComponents: Record<"extended" | "native" | "all", Component[]> =
  (() => {
    const conditionComponents: Record<
      "extended" | "native" | "all",
      Component[]
    > = {
      extended: [],
      native: [],
      all: [],
    };
    let i = 0;
    while (i < otherComponents.length) {
      const hasInfer = _.random(0, 1) === 1;
      const left = otherComponents[i];
      const right = hasInfer
        ? _.sample(inferComponents.all)
        : otherComponents[i + 1];
      const then = otherComponents[i + 2];
      const els = otherComponents[i + 3];

      if (!left || !right || !then || !els) break;

      const generateContent = (isNative: boolean) => {
        return utils.mergeString(
          left.content,
          isNative ? " extends " : " == ",
          right.content,
          " ? ",
          then.content,
          " : ",
          els.content
        );
      };

      const node = utils.createNode({
        instance: ast.ConditionExpression,
        kind: ast.Type.SyntaxKind.E.Condition,
        output: utils.mergeString(
          left.node.output!,
          " extends ",
          right.node.output!,
          " ? ",
          then.node.output!,
          " : ",
          els.node.output!
        ),
        left: left.node,
        right: right.node,
        then: then.node,
        else: els.node,
      });

      conditionComponents.native.push({
        content: generateContent(true),
        node,
      });

      conditionComponents.extended.push({
        content: generateContent(false),
        node,
      });

      i += 4;
    }

    conditionComponents.all = [
      ...conditionComponents.native,
      ...conditionComponents.extended,
    ];

    return conditionComponents;
  })();
