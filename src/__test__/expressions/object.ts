import * as ast from "../../ast";
import * as utils from "../utils";
import _ from "lodash-es";
import type { Expression } from "./";
import { functionExpressions } from "./function";
import { identifierTemplates } from "./identifier";
import { arrayExpressions } from "./array";
import { bracketSurroundExpressions } from "./bracket-surround";
import { conditionExpressions } from "./condition";
import { getKeyValueExpressions } from "./get-key-value";
import { literalExpressions } from "./literal";
import { tupleExpressions } from "./tuple";
import { unionExpressions } from "./union";

export { expressions as objectExpressions };

type ObjectContentName = Uncapitalize<
  keyof typeof ast.Object.Content
> extends `${infer T}Expression`
  ? T
  : never;
type ObjectExpressions = Record<
  "simple" | "complex",
  Record<ObjectContentName, Expression[]>
>;
const expressions: ObjectExpressions = {
  complex: {
    call: [],
    constructor: [],
    method: [],
    indexSignature: [],
    literalIndex: [],
    mapped: [],
    normal: [],
  },
  simple: {
    call: [],
    constructor: [],
    method: [],
    indexSignature: [],
    literalIndex: [],
    mapped: [],
    normal: [],
  },
};

function generateObjectOutput(contents: string[]) {
  return utils.mergeString(
    "{\n",
    contents.map((item) => `  ${item};`).join("\n"),
    "\n}"
  );
}

(function initSimple() {
  expressions.simple.call = [
    {
      content: `{ (): void }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["(): void"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.CallExpression,
            return: utils.createNode({
              instance: ast.Function.Return.Expression,
              output: "void",
            }),
            output: "(): void",
          }),
        ],
      }),
    },
    {
      content: `{ 
        (name: string, age?: number):string,
        ():void;
        ()
        <T>()
      }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([
          "(name: string, age?: number): string",
          "(): void",
          "()",
          "<T>()",
        ]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.CallExpression,
            body: utils.createNode({
              instance: ast.Function.Body.Expression,
              args: [
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "name",
                  }),
                  type: utils.createNode({
                    instance: ast.LiteralKeywordExpression,
                    output: "string",
                  }),
                  optional: false,
                  rest: false,
                },
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "age",
                  }),
                  type: utils.createNode({
                    instance: ast.LiteralKeywordExpression,
                    output: "number",
                  }),
                  optional: true,
                  rest: false,
                },
              ],
            }),
            return: utils.createNode({
              instance: ast.Function.Return.Expression,
              output: "string",
            }),
            output: "(name: string, age?: number): string",
          }),
          utils.createNode({
            instance: ast.Object.Content.CallExpression,
            return: utils.createNode({
              instance: ast.Function.Return.Expression,
              output: "void",
            }),
            output: "(): void",
          }),
          utils.createNode({
            instance: ast.Object.Content.CallExpression,
            output: "()",
          }),
          utils.createNode({
            instance: ast.Object.Content.CallExpression,
            output: "<T>()",
            genericArgs: utils.createNode({
              instance: ast.GenericArgsExpression,
              values: [
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "T",
                  }),
                  default: void 0,
                  type: void 0,
                },
              ],
            }),
          }),
        ],
      }),
    },
  ];

  expressions.simple.constructor = [
    {
      content: `{ new (): void }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["new (): void"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.ConstructorExpression,
            body: utils.createNode({
              instance: ast.Function.Mode.NormalExpression,
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "void",
              }),
            }),
            output: "new (): void",
          }),
        ],
      }),
    },
    {
      content: `{ 
        new (name: string, age?: number):string,
        new ():void;
      }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([
          "new (name: string, age?: number): string",
          "new (): void",
        ]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.ConstructorExpression,
            body: utils.createNode({
              instance: ast.Function.Mode.NormalExpression,
              body: utils.createNode({
                instance: ast.Function.Body.Expression,
                args: [
                  {
                    id: utils.createNode({
                      instance: ast.IdentifierExpression,
                      output: "name",
                    }),
                    type: utils.createNode({
                      instance: ast.LiteralKeywordExpression,
                      output: "string",
                    }),
                    optional: false,
                    rest: false,
                  },
                  {
                    id: utils.createNode({
                      instance: ast.IdentifierExpression,
                      output: "age",
                    }),
                    type: utils.createNode({
                      instance: ast.LiteralKeywordExpression,
                      output: "number",
                    }),
                    optional: true,
                    rest: false,
                  },
                ],
              }),
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "string",
              }),
            }),
            output: "new (name: string, age?: number): string",
          }),
          utils.createNode({
            instance: ast.Object.Content.ConstructorExpression,
            body: utils.createNode({
              instance: ast.Function.Mode.NormalExpression,
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "void",
              }),
            }),
            output: "new (): void",
          }),
        ],
      }),
    },
  ];
  expressions.simple.method = [
    {
      content: `{ foo(): void }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["foo(): void"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.MethodExpression,
            kind: ast.Type.SyntaxKind.E.Object_Method,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "foo",
            }),
            body: utils.createNode({
              instance: ast.Function.Mode.NormalExpression,
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "void",
              }),
            }),
            optional: false,
            output: "foo(): void",
          }),
        ],
      }),
    },
    {
      content: `{ 
        foo(age?: number):any,
        bar?():void;
      }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([
          "foo(age?: number): any",
          "bar?(): void",
        ]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.MethodExpression,
            kind: ast.Type.SyntaxKind.E.Object_Method,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "foo",
            }),
            optional: false,
            body: utils.createNode({
              instance: ast.Function.Mode.NormalExpression,
              body: utils.createNode({
                instance: ast.Function.Body.Expression,
                args: [
                  {
                    id: utils.createNode({
                      instance: ast.IdentifierExpression,
                      output: "age",
                    }),
                    type: utils.createNode({
                      instance: ast.LiteralKeywordExpression,
                      output: "number",
                    }),
                    optional: true,
                    rest: false,
                  },
                ],
              }),
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "any",
              }),
            }),
            output: "foo(age?: number): any",
          }),
          utils.createNode({
            instance: ast.Object.Content.MethodExpression,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "bar",
            }),
            optional: true,
            body: utils.createNode({
              instance: ast.Function.Mode.NormalExpression,
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "void",
              }),
            }),
            output: "bar?(): void",
          }),
        ],
      }),
    },
  ];

  expressions.simple.normal = [
    {
      content: `{ name: string }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["name: string"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.NormalExpression,
            kind: ast.Type.SyntaxKind.E.Object_Normal,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "name",
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            optional: false,
            output: "name: string",
          }),
        ],
      }),
    },
    {
      content: `{ name: string, age?: number }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["name: string", "age?: number"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.NormalExpression,
            kind: ast.Type.SyntaxKind.E.Object_Normal,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "name",
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            optional: false,
            output: "name: string",
          }),
          utils.createNode({
            instance: ast.Object.Content.NormalExpression,
            kind: ast.Type.SyntaxKind.E.Object_Normal,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "age",
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "number",
            }),
            optional: true,
            output: "age?: number",
          }),
        ],
      }),
    },
  ];

  expressions.simple.literalIndex = [
    {
      content: "{ ['age']: number }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["['age']: number"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.LiteralIndexExpression,
            kind: ast.Type.SyntaxKind.E.Object_LiteralIndex,
            literalName: utils.createNode({
              instance: ast.StringLiteralExpression,
              output: "'age'",
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "number",
            }),
            optional: false,
            output: "['age']: number",
          }),
        ],
      }),
    },
    {
      content: "{ ['age']: number, [123]?: string }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["['age']: number", "[123]?: string"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.LiteralIndexExpression,
            kind: ast.Type.SyntaxKind.E.Object_LiteralIndex,
            literalName: utils.createNode({
              instance: ast.StringLiteralExpression,
              output: "'age'",
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "number",
            }),
            optional: false,
            output: "['age']: number",
          }),
          utils.createNode({
            instance: ast.Object.Content.LiteralIndexExpression,
            kind: ast.Type.SyntaxKind.E.Object_LiteralIndex,
            literalName: utils.createNode({
              instance: ast.NumberLiteralExpression,
              output: "123",
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            optional: true,
            output: "[123]?: string",
          }),
        ],
      }),
    },
  ];

  expressions.simple.indexSignature = [
    {
      content: "{ [key: string]: any }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["[key: string]: any"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.IndexSignatureExpression,
            kind: ast.Type.SyntaxKind.E.Object_IndexSignature,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "key",
            }),
            nameType: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "any",
            }),
            output: "[key: string]: any",
          }),
        ],
      }),
    },
  ];

  expressions.simple.mapped = [
    {
      content: "{ [K in 'name' | 'age']: string }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["[K in 'name' | 'age']: string"]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.MappedExpression,
            kind: ast.Type.SyntaxKind.E.Object_Mapped,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "K",
            }),
            inSource: utils.createNode({
              instance: ast.UnionExpression,
              kind: ast.Type.SyntaxKind.E.Union,
              output: "'name' | 'age'",
              values: [
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: "'name'",
                }),
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: "'age'",
                }),
              ],
            }),
            value: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            output: "[K in 'name' | 'age']: string",
            asTarget: false,
            operator: [false, false],
          }),
        ],
      }),
    },
    {
      content: "{ [K in Union[number] as Filter<K>]?: Array<K> }",
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([
          "[K in Union[number] as Filter<K>]?: Array<K>",
        ]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.MappedExpression,
            kind: ast.Type.SyntaxKind.E.Object_Mapped,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "K",
            }),
            inSource: utils.createNode({
              instance: ast.GetKeyValueExpression,
              output: "Union[number]",
              source: utils.createNode({
                instance: ast.TypeReferenceExpression,
                output: "Union",
              }),
              key: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "number",
              }),
            }),
            value: utils.createNode({
              instance: ast.TypeReferenceExpression,
              output: "Array<K>",
              identifier: utils.createNode({
                instance: ast.IdentifierExpression,
                output: "Array",
              }),
            }),
            output: "[K in Union[number] as Filter<K>]?: Array<K>",
            asTarget: utils.createNode({
              instance: ast.TypeReferenceExpression,
              output: "Filter<K>",
              identifier: utils.createNode({
                instance: ast.IdentifierExpression,
                output: "Filter",
              }),
              arguments: [
                utils.createNode({
                  instance: ast.TypeReferenceExpression,
                  output: "K",
                }),
              ],
            }),
            operator: [false as any, true],
          }),
        ],
      }),
    },
  ];
})();

(function initComplex() {
  expressions.complex.call = functionExpressions.normal.map((item) => {
    return {
      content: `{ ${item.content} }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([item.node.output!]),
        contents: [item.node],
      }),
    };
  });

  expressions.complex.constructor = functionExpressions.normal.map((item) => {
    return {
      content: `{ new ${item.content} }`,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput(["new " + item.node.output!]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.ConstructorExpression,
            body: item.node,
            output: "new " + item.node.output,
          }),
        ],
      }),
    };
  });

  expressions.complex.method = functionExpressions.normal.map((item) => {
    const optional = _.random(0, 1) === 1;
    const id = _.sample(identifierTemplates)!;
    const content = "{ " + id + (optional ? "?" : "") + item.content + " }";
    const output = id + (optional ? "?" : "") + item.node.output!;

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([output]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.MethodExpression,
            kind: ast.Type.SyntaxKind.E.Object_Method,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: id,
            }),
            optional,
            body: item.node,
            output,
          }),
        ],
      }),
    };
  });

  const otherExpressions = [
    ..._.sampleSize(functionExpressions.arrow, 100),
    ..._.sampleSize(arrayExpressions, 100),
    ..._.sampleSize(bracketSurroundExpressions, 100),
    ..._.sampleSize(conditionExpressions.all, 100),
    ..._.sampleSize(getKeyValueExpressions, 100),
    ..._.sampleSize(literalExpressions.all, 100),
    ..._.sampleSize(tupleExpressions, 100),
    ..._.sampleSize(unionExpressions.all, 100),
  ];

  expressions.complex.normal = otherExpressions.map((item) => {
    const id = _.sample(identifierTemplates)!;
    const optional = _.random(0, 1) === 1;
    const content =
      "{ " + id + (optional ? "?" : "") + ": " + item.content + " }";
    const output = id + (optional ? "?" : "") + ": " + item.node.output!;

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([output]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.NormalExpression,
            kind: ast.Type.SyntaxKind.E.Object_Normal,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: id,
            }),
            optional,
            value: item.node,
            output,
          }),
        ],
      }),
    };
  });

  expressions.complex.literalIndex = _.sampleSize(
    [...literalExpressions.number, ...literalExpressions.string],
    100
  ).map((literalName) => {
    const value = _.sample(otherExpressions)!;
    const optional = _.random(0, 1) === 1;
    const content = `{ [${literalName.content}]${optional ? "?" : ""}: ${
      value.content
    } }`;
    const output = `[${literalName.node.output}]${optional ? "?" : ""}: ${
      value.node.output
    }`;

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([output]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.LiteralIndexExpression,
            kind: ast.Type.SyntaxKind.E.Object_LiteralIndex,
            literalName: literalName.node,
            optional,
            value: value.node,
            output,
          }),
        ],
      }),
    };
  });

  expressions.complex.indexSignature = _.sampleSize(otherExpressions, 100).map(
    (nameType) => {
      const id = _.sample(identifierTemplates)!;
      const value = _.sample(otherExpressions)!;
      const content = `{ [${id}: ${nameType.content}]: ${value.content} }`;
      const output = `[${id}: ${nameType.node.output}]: ${value.node.output}`;

      return {
        content,
        node: utils.createNode({
          instance: ast.Object.Expression,
          kind: ast.Type.SyntaxKind.E.Object,
          output: generateObjectOutput([output]),
          contents: [
            utils.createNode({
              instance: ast.Object.Content.IndexSignatureExpression,
              kind: ast.Type.SyntaxKind.E.Object_IndexSignature,
              value: value.node,
              name: utils.createNode({
                instance: ast.IdentifierExpression,
                output: id,
              }),
              nameType: nameType.node,
              output,
            }),
          ],
        }),
      };
    }
  );

  expressions.complex.mapped = otherExpressions.map((value) => {
    const id = _.sample(identifierTemplates)!;
    const operator = {
      remove: _.random(0, 1) === 1,
      optional: _.random(0, 1) === 1,
    };
    const inSource = _.sample(otherExpressions)!;
    const asTarget = _.random(0, 1) === 1 ? _.sample(otherExpressions)! : false;

    const content = utils.mergeString(
      "{ [",
      id,
      " in ",
      inSource.content,
      asTarget ? " as " + asTarget.content : "",
      "]",
      operator.remove ? " -?" : operator.optional ? "?" : "",
      ": ",
      value.content,
      " }"
    );

    const output = utils.mergeString(
      "[",
      id,
      " in ",
      inSource.node.output!,
      asTarget ? " as " + asTarget.node.output : "",
      "]",
      operator.remove ? "-?" : operator.optional ? "?" : "",
      ": ",
      value.node.output!
    );

    return {
      content,
      node: utils.createNode({
        instance: ast.Object.Expression,
        kind: ast.Type.SyntaxKind.E.Object,
        output: generateObjectOutput([output]),
        contents: [
          utils.createNode({
            instance: ast.Object.Content.MappedExpression,
            kind: ast.Type.SyntaxKind.E.Object_Mapped,
            value: value.node,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              output: id,
            }),
            inSource: inSource.node,
            asTarget: asTarget ? asTarget.node : false,
            operator: operator.remove
              ? [true, true]
              : ([false, operator.optional] as any),
            output,
          }),
        ],
      }),
    };
  });
})();
