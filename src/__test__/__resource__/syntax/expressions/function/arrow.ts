import * as utils from "../../../utils";
import * as ast from "../../../../../ast";
import { Return } from "./return";
import { Body } from "./body";

export { Arrow };

namespace Arrow {
  export const nodes = (() => {
    const nodes = [];

    for (const body of Body.components) {
      const returnAllComponents = [
        ...Return.components.assertAndIs,
        ...Return.components.isOnly,
        ...Return.components.normal,
      ];
      
      for (const ret of returnAllComponents) {
        nodes.push(
          utils.createSource({
            content: `type A = ${body.content} => ${ret.content}`,
            nodes: [
              utils.createNode({
                instance: ast.TypeDeclarationStatement,
                output: `type A = ${body.node.output} => ${ret.node.output};`,
                identifier: utils.createNode({
                  instance: ast.IdentifierExpression,
                  output: "A",
                }),
                value: utils.createNode({
                  instance: ast.Function.Mode.Arrow.Expression,
                  output: `${body.node.output} => ${ret.node.output}`,
                  body: body.node,
                  return: ret.node,
                }),
              }),
            ],
          })
        );
      }
    }

    return nodes;
  })();
}
