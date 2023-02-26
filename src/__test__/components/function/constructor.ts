import * as ast from "../../../ast";
import * as utils from "../../utils";
import { Component } from "../types";
import { arrowComponents } from "./arrow";

export { components as constructorComponents };

const components: Component[] = arrowComponents.map((component) => {
  return {
    content: `new ${component.content}`,
    node: utils.createNode({
      instance: ast.Function.Mode.ConstructorExpression,
      output: `new ${component.node.output}`,
      body: component.node,
    }),
  };
});
