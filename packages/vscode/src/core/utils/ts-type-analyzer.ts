import ts from 'typescript';

export { tsTypeAnalyzer };

interface DiagnosticInfo {
  fileName?: string;
  line?: number;
  character?: number;
  message: string;
}

class TSTypeAnalyzer {
  private _sourceCode: string;
  private _compilerOptions: ts.CompilerOptions;
  private _sourceFile: ts.SourceFile;
  private _program: ts.Program;
  private _checker: ts.TypeChecker;

  constructor() {
    this._sourceCode = '';
    this._compilerOptions = {
      noEmitOnError: true,
      reportDiagnostics: true,
      types: ['@type-zen/core/preset']
    };

    this._updateSourceFileAndProgram('');
  }

  private _updateSourceFileAndProgram(sourceCode: string): void {
    this._sourceCode = sourceCode;
    this._sourceFile = ts.createSourceFile(
      'temp.ts',
      sourceCode,
      ts.ScriptTarget.ES5,
      true
    );
    this._program = ts.createProgram({
      rootNames: ['temp.ts'],
      options: this._compilerOptions,
      host: {
        ...ts.createCompilerHost(this._compilerOptions),
        getSourceFile: (fileName: string) =>
          fileName === 'temp.ts' ? this._sourceFile : undefined
      }
    });
    this._checker = this._program.getTypeChecker();
  }
  public getDiagnostics(sourceCode: string): DiagnosticInfo[] {
    this._updateSourceFileAndProgram(sourceCode);

    const diagnostics = ts.getPreEmitDiagnostics(this._program);
    const diagnosticInfo: DiagnosticInfo[] = diagnostics
      .filter(diagnostic => diagnostic.file)
      .map(diagnostic => {
        const { line, character } = ts.getLineAndCharacterOfPosition(
          diagnostic.file!,
          diagnostic.start!
        );
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

        return {
          fileName: diagnostic.file!.fileName,
          line: line + 1,
          character: character + 1,
          message: message
        };
      });

    return diagnosticInfo;
  }

  public getTypeAtPosition(
    sourceCode: string,
    line: number,
    character: number
  ): string | null {
    this._updateSourceFileAndProgram(sourceCode);
    const position = ts.getPositionOfLineAndCharacter(
      this._sourceFile,
      line - 1,
      character - 1
    );
    const node = findNodeAtPosition(this._sourceFile, position);

    if (node && node.parent && ts.isTypeAliasDeclaration(node.parent)) {
      const type = this._checker.getTypeFromTypeNode(node.parent.type);
      const typeResult = this._checker.typeToString(
        type,
        undefined,
        ts.TypeFormatFlags.InTypeAlias
      );

      return typeResult;
    }

    return null;

    function findNodeAtPosition(node: ts.Node, position: number): ts.Node | null {
      if (position >= node.getStart() && position <= node.getEnd()) {
        let result: ts.Node | null = null;

        ts.forEachChild(node, child => {
          const found = findNodeAtPosition(child, position);

          if (found) {
            result = found;
          }
        });

        return result || node;
      }

      return null;
    }
  }
}

const tsTypeAnalyzer = new TSTypeAnalyzer();
