import ts from 'typescript';

export { tsTypeAnalyzer };

interface DiagnosticInfo {
  fileName?: string;
  line?: number;
  character?: number;
  message: string;
}

class TSTypeAnalyzer {
  private sourceCode: string;
  private compilerOptions: ts.CompilerOptions;
  private sourceFile: ts.SourceFile;
  private program: ts.Program;
  private checker: ts.TypeChecker;

  constructor() {
    this.sourceCode = '';
    this.compilerOptions = {
      noEmitOnError: true,
      reportDiagnostics: true,
      types: ['@type-zen/core/preset']
    };

    this.updateSourceFileAndProgram('');
  }

  private updateSourceFileAndProgram(sourceCode: string): void {
    this.sourceCode = sourceCode;
    this.sourceFile = ts.createSourceFile(
      'temp.ts',
      sourceCode,
      ts.ScriptTarget.ES5,
      true
    );
    this.program = ts.createProgram({
      rootNames: ['temp.ts'],
      options: this.compilerOptions,
      host: {
        ...ts.createCompilerHost(this.compilerOptions),
        getSourceFile: (fileName: string) =>
          fileName === 'temp.ts' ? this.sourceFile : undefined
      }
    });
    this.checker = this.program.getTypeChecker();
  }
  public getDiagnostics(sourceCode: string): DiagnosticInfo[] {
    this.updateSourceFileAndProgram(sourceCode);

    const diagnostics = ts.getPreEmitDiagnostics(this.program);
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
    this.updateSourceFileAndProgram(sourceCode);
    const position = ts.getPositionOfLineAndCharacter(
      this.sourceFile,
      line - 1,
      character - 1
    );
    const node = findNodeAtPosition(this.sourceFile, position);

    if (node && node.parent && ts.isTypeAliasDeclaration(node.parent)) {
      const type = this.checker.getTypeFromTypeNode(node.parent.type);
      const typeResult = this.checker.typeToString(
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
