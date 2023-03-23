import * as moo from 'moo';

const lexer = moo.states({
  main: {
    // tplStart: { match: /`/, push: 'tpl' },
    ws: { match: /\s+/, lineBreaks: true },
    newLine: { match: /\n/, lineBreaks: true },
    lineComment: /\/\/.*?$/,
    multilineCommentStart: { match: '/*', push: 'multilineComment' },
    // js 的 number，包含了 16 进制，8 进制，浮点数，负正整数
    // number: /-?0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|\d*\.\d+|\d+\.?([eE][+-]?\d+)?/,
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    // 字符串字面量，包围符号为“双引号、单引号”
    string: /"(?:\\["\\]|[^\n"])*"|'(?:\\['\\]|[^\n'])*'|`(?:\\[`\\]|[^`])*`/,
    literalKeyword: [
      'string',
      'number',
      'null',
      'undefined',
      'never',
      'any',
      'symbol',
      'void',
      'unknown',
      'this',
      ...['true', 'false', 'boolean']
    ],
    restOrSpread: ['...'],
    extend: ['extends', '=='],
    return: ['return'],
    arrowFnSymbol: '=>',
    symbol: [':', ';', '.', ',', '?', '|', '<', '>', '=', '-', '&', '^'],
    lbracket: ['{', '[', '('],
    rbracket: ['}', ']', ')'],
    identifier: {
      match: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
      type: moo.keywords({
        keyword: [
          'if',
          'for',
          'of',
          'else',
          'in',
          'void',
          'this',
          'new',
          'function',
          'interface',
          'namespace',
          'keyof',
          'typeof',
          'type',
          'as',
          'is',
          'out',
          'infer',
          'asserts',
          'declare',
          'readonly'
        ]
      })
    }
  },
  tpl: {
    tplEnd: { match: /`/, pop: 1 },
    tplInterpStart: { match: /\$\{\s*/, push: 'tplInterp', lineBreaks: true },
    tplString: { match: /(?!\$\{)(?:[^`\\]|\\[\s\S])/, lineBreaks: true }
  },
  tplInterp: {
    tplInterpEnd: { match: '}', pop: 1 },
    tplInterpString: /"(?:\\["\\]|[^\n"\\])*"|'(?:\\['\\]|[^\n'\\])*'/,
    tplInterpContent: { match: /(?:[^`\}\\]|\\[\s\S])+/, lineBreaks: true },
    tplInterpStart: { match: /\$\{\s*/, push: 'tplInterp', lineBreaks: true }
  },
  multilineComment: {
    multilineCommentStart: { match: '/*', push: 'multilineComment' },
    multilineCommentEnd: { match: '*/', pop: 1 },
    multilineCommentString: { match: /[^]+?/, lineBreaks: true }
  }
});

export default lexer;
