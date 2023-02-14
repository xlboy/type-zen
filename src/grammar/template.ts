const expressionTemplate = {
  condition: [
    `true == false`,
    `true == 1`,
    `true == "1"`,
    `123 == "123"`,
    `123 == 121 ? 1 : 2 == 2 ? 3 : 4`,
    `(123 == 121 ? 1 : 2) == 2`,
  ],
  union: [
    `"n" | 1 | true`,
    `| 1 | true | "sss"`,
    `123 == 121 ? 1 : 2 == 2 ? 3 : 4 | 1 | true | "sss"`,
    `(123 == 121 ? 1 : 2 == 2 ? 3 : 4) | 1 | true | "sss"`,
  ],
};
export const grammarTemplate = {
  typeDef: {
    literal: {
      string: [
        `type name  = "n"`,
        `type name1\n=          "n";;;;`,
        `type name2= \`one piece\``,
      ],
      number: [
        `type name  = 1`,
        `type name1\n=       1;;`,
        `type name2= 0x1`,
        `type name3= 0o1`,
      ],
      boolean: [
        `type name  = true`,
        `type name1\n=    \n      false\n;`,
        `type name2= false`,
        `type name3= true`,
      ],
    },
    union: [
      `type name  = ${expressionTemplate.union[0]}`,
      `type name2 = ${expressionTemplate.union[1]};`,
    ],
  },
  expression: expressionTemplate,
};
