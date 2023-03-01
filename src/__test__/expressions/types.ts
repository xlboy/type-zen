import { TestNode } from "../utils";

export { type Expression };

interface Expression {
  content: string;
  node: TestNode;
}
