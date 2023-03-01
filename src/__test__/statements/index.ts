import type { TestNode } from "../utils";

export { declareVariableStatements } from "./declare-variable";

export type { Statement };

interface Statement {
  content: string;
  node: TestNode;
}
