import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { bracketSurroundExpressions } from "./bracket-surround";
import { getKeyValueExpressions } from "./get-key-value";
import { literalExpressions } from "./literal";
import { tupleExpressions } from "./tuple";
import { typeReferenceExpressions } from "./type-reference";
import { Expression } from "./";
import { unionExpressions } from "./union";
import { identifierTemplates } from "./identifier";
export { conditionExpressions, inferExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(unionExpressions.all, 3000),
  ..._.sampleSize(tupleExpressions, 3000),
  ..._.sampleSize(getKeyValueExpressions, 3000),
  ...bracketSurroundExpressions,
];

const inferExpressions: Record<"extended" | "native" | "all", Expression[]> =
  (() => {
    const inferExpressions: Record<"extended" | "native" | "all", Expression[]> =
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
        _.sampleSize(otherExpressions, extendsSize).forEach((item) => {
          extendsTypes.push(item.node);

          native.content += ` extends ${item.content}`;
          native.output += ` extends ${item.node.output}`;
          extended.content += ` == ${item.content}`;
          extended.output += ` extends ${item.node.output}`;
        });
      }

      inferExpressions.native.push({
        content: `infer ${native.content}`,
        node: utils.createNode({
          instance: ast.InferExpression,
          kind: ast.Type.SyntaxKind.E.Infer,
          output: `infer ${native.output}`,
          name: id,
          extendsTypes,
        }),
      });

      inferExpressions.extended.push({
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

    inferExpressions.all = [
      ...inferExpressions.native,
      ...inferExpressions.extended,
    ];

    return inferExpressions;
  })();

const conditionExpressions: Record<"extended" | "native" | "all", Expression[]> =
  (() => {
    const conditionExpressions: Record<
      "extended" | "native" | "all",
      Expression[]
    > = {
      extended: [],
      native: [],
      all: [],
    };
    let i = 0;
    while (i < otherExpressions.length) {
      const hasInfer = _.random(0, 1) === 1;
      const left = otherExpressions[i];
      const right = hasInfer
        ? _.sample(inferExpressions.all)
        : otherExpressions[i + 1];
      const then = otherExpressions[i + 2];
      const els = otherExpressions[i + 3];

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

      conditionExpressions.native.push({
        content: generateContent(true),
        node,
      });

      conditionExpressions.extended.push({
        content: generateContent(false),
        node,
      });

      i += 4;
    }

    conditionExpressions.all = [
      ...conditionExpressions.native,
      ...conditionExpressions.extended,
    ];

    return conditionExpressions;
  })();