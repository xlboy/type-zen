import moo from "moo";

const lexer = moo.compile({
  ws: { match: /\s/, lineBreaks: true },
  newLine: { match: /\n/, lineBreaks: true },
  comment: /\/\/.*?$/,
  // js 的 number，包含了 16 进制，8 进制，浮点数，负正整数
  // number: /-?0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|\d*\.\d+|\d+\.?([eE][+-]?\d+)?/,
  number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  // 字符串字面量，包围符号为“双引号、单引号、反引号”
  string:
    /"(?:\\["\\]|[^\n"\\])*"|'(?:\\['\\]|[^\n'\\])*'|`(?:\\[`\\]|[^\n`\\])*`/,
  valueKeyword: [
    "string",
    "number",
    "null",
    "undefined",
    "never",
    "any",
    "symbol",
    "void",
    "unknown",
    "this",
    ...["true", "false", "boolean"],
  ],
  restOrSpread: ["..."],
  extend: ["extends", "=="],
  arrowFnSymbol: "=>",
  symbol: [":", ";", ".", ",", "?", "|", "<", ">", "="],
  lbracket: ["{", "[", "("],
  rbracket: ["}", "]", ")"],
  identifier: {
    match: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
    type: moo.keywords({
      keyword: ["if", "else", "in", "void", "this"],
    }),
  },
  // 又能作为标识符，又能作为关键字的关键字
  multifunctionalKeyword: [
    "interface",
    "namespace",
    "keyof",
    "type",
    "as",
    "is",
    "out",
    "infer",
    "asserts",
  ],
});

export default lexer;
