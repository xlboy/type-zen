import nearley from "nearley";
import * as ast from "../ast";
import langGrammar from "../grammar/__lang.auto-generated__";

export { Parser, NearleyError };

namespace NearleyError {
  type ErrorOrigin = Error & { offset: number; token?: moo.Token };
  export class UnexpectedInput extends SyntaxError {
    public offset: number;
    public line: number;
    public col: number;
    public message: string;

    private errorOrigin: ErrorOrigin;

    constructor(
      line: number,
      col: number,
      offset: number,
      errorOrigin: ErrorOrigin
    ) {
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
      const lineColRegex =
        /^(?:invalid syntax|Syntax error) at line (\d+) col (\d+):/;
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
          "offset" in error &&
          typeof error["offset"] === "number" &&
          (error as any)["token"] === undefined) ||
        "lineBreaks" in (error as any)["token"]
      );
    }
  }
}

class Parser {
  private readonly parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(langGrammar)
  );

  private readonly content: string;

  constructor(content: string) {
    this.content = content;
  }

  public toAST(): Array<ast.Base> {
    try {
      this.parser.feed(this.content);
    } catch (error) {
      const nearleyError = new NearleyError._Handler(error);
      if (nearleyError.isNearley) {
        throw nearleyError.get();
      }

      throw error;
    }
    if (this.parser.results.length !== 0) {
      return this.parser.results[0];
    }

    return [];
  }
}
