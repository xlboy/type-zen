import moo from "moo";

const lexer = moo.compile({
  ws: { match: /\s/, lineBreaks: true },
  newLine: { match: /\r?\n/, lineBreaks: true },
  comment: /\/\/.*?$/,
  // js 的 number，包含了 16 进制，8 进制，浮点数，负正整数
  // number: /-?0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|\d*\.\d+|\d+\.?([eE][+-]?\d+)?/,
  number: /-?(?:0b[01]+|0o[0-7]+|0x[0-9a-fA-F]+|\d+)/,
  // 字符串字面量，包围符号为“双引号、单引号、反引号”
  string:
    /"(?:\\["\\]|[^\n"\\])*"|'(?:\\['\\]|[^\n'\\])*'|`(?:\\[`\\]|[^\n`\\])*`/,
  boolean: ["true", "false"],
  never: "never",
  type: "type",
  interface: "interface",
  extends: ["extends", "=="],
  assignment: "=",
  lParan: "(",
  rParan: ")",
  comma: ",",
  lBracket: "[",
  rBracket: "]",
  lBrace: "{",
  rBrace: "}",
  semicolon: ";",
  or: "|",
  if: "if",
  else: "else",


  identifier: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
});

export default lexer;
