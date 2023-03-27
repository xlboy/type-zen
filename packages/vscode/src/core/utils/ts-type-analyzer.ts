import ts from 'typescript';

export { tsTypeAnalyzer };

interface DiagnosticInfo {
  fileName?: string;
  line?: number;
  character?: number;
  message: string;
}

class TSTypeAnalyzer {
  private compilerOptions: ts.CompilerOptions;
  private sourceFile: ts.SourceFile;
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private presetSourceFile = ts.createSourceFile(
    'preset.d.ts',
    `
    // @ts-ignore
    const _typeZenUnreturnSymbol: unique symbol = Symbol();
    
    /** TypeZen Unreturned Symbol */
    type TZ_URS = typeof _typeZenUnreturnSymbol;
`,
    ts.ScriptTarget.ES5,
    true
  );

  constructor() {
    this.compilerOptions = {
      noEmitOnError: true,
      reportDiagnostics: true
    };

    this.updateSourceFileAndProgram('');
  }

  private updateSourceFileAndProgram(sourceCode: string): void {
    this.sourceFile = ts.createSourceFile(
      'temp.ts',
      sourceCode,
      ts.ScriptTarget.ES5,
      true
    );
    this.program = ts.createProgram({
      rootNames: ['temp.ts', 'preset.d.ts'],
      options: this.compilerOptions,
      host: {
        ...ts.createCompilerHost(this.compilerOptions),
        getSourceFile: (fileName: string) =>
          ({
            'temp.ts': this.sourceFile,
            'preset.d.ts': this.presetSourceFile
          }[fileName])
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

    if (!node) return null;

    if (node.parent && ts.isTypeAliasDeclaration(node.parent)) {
      return getType.call(this, node.parent.type);
    } else if (ts.isTypeAliasDeclaration(node)) {
      return getType.call(this, node.type);
    }

    return null;

    function getType(this: TSTypeAnalyzer, type: ts.TypeNode) {
      return this.checker.typeToString(
        this.checker.getTypeFromTypeNode(type),
        undefined,
        ts.TypeFormatFlags.InTypeAlias
      );
    }

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
