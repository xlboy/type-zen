import { merge } from 'lodash-es';
import nearley from 'nearley';
import type { O } from 'ts-toolbelt';

import type { ExpressionBase } from './ast';
import type { StatementBase } from './ast/statements/base';
import langGrammar from './grammar/__lang.auto-generated__';

export { NearleyError, Parser };

namespace NearleyError {
  export type ErrorOrigin = Error & { offset: number; token?: moo.Token };

  export class UnexpectedInput extends SyntaxError {
    public offset: number;
    public line: number;
    public col: number;
    public message: string;

    private errorOrigin?: ErrorOrigin;

    constructor(line: number, col: number, offset: number, errorOrigin: ErrorOrigin) {
      super(`Unexpected input at line ${line} col ${col}`);
      this.offset = offset;
      this.line = line;
      this.col = col;
      this.errorOrigin = errorOrigin;
      this.message = errorOrigin.message;
    }
  }

  export class _Handler {
    private error: ErrorOrigin;
    public isNearley = false;

    constructor(error: unknown) {
      if (this.is(error)) {
        this.error = error;
        this.isNearley = true;
      }
    }

    public get() {
      const lineColRegex = /^(?:invalid syntax|Syntax error) at line (\d+) col (\d+):/;
      const matchedLineCol = this.error.message.match(lineColRegex);

      if (matchedLineCol) {
        const [, line, col] = matchedLineCol;

        return new UnexpectedInput(+line, +col, this.error.offset, this.error);
      }

      return this.error;
    }

    private is(error: unknown): error is typeof this.error {
      return (
        (error instanceof Error &&
          'offset' in error &&
          typeof error['offset'] === 'number' &&
          (error as any)['token'] === undefined) ||
        'lineBreaks' in (error as any)['token']
      );
    }
  }
}

interface ParserOptions {
  /**
   * @default 'statement'
   */
  source?: 'expression' | 'statement';
}

class Parser<S extends ParserOptions['source'] = 'statement'> {
  private readonly options: O.Required<ParserOptions, 'string', 'deep'> = {
    source: 'statement'
  };
  private nearleyParser: nearley.Parser;

  constructor(
    options?: Omit<ParserOptions, 'mode'> & {
      /**
       * @default 'statement'
       */ source?: S;
    }
  ) {
    merge(this.options, options || {});
    this.initNearleyParser();
  }

  private initNearleyParser() {
    const rules = { ...langGrammar };

    if (this.options.source === 'expression') {
      rules.ParserStart = 'e_main';
    }

    this.nearleyParser = new nearley.Parser(nearley.Grammar.fromCompiled(rules));
  }

  public parse(
    content: string
  ): (S extends 'expression' ? ExpressionBase : StatementBase[]) | null {
    try {
      this.nearleyParser.feed(content);
    } catch (error) {
      const nearleyError = new NearleyError._Handler(error);

      if (nearleyError.isNearley) {
        throw nearleyError.get();
      }

      throw error;
    }

    if (this.nearleyParser.results.length !== 0) {
      return this.nearleyParser.results[0];
    }

    return null;
  }
}
