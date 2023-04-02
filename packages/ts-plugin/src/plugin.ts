import fs from 'node:fs';
import path from 'node:path';

import { version as corePackageVersion } from '@type-zen/core/package.json';
import type ts from 'typescript/lib/tsserverlibrary';

import { version } from '../package.json';
import { Logger } from './logger';
import { SnapshotManager } from './snapshot';

export { TypeZenPlugin };

let isFirst = true;

class TypeZenPlugin implements ts.server.PluginModule {
  private readonly ts: typeof ts;
  private logger: Logger;
  private projectDirPath!: string;
  private snapshotManager: SnapshotManager;

  constructor(_ts: typeof ts) {
    this.ts = _ts;
  }

  public create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    this.logger = new Logger(info);
    this.logger.log(`Plugin version: ${version}`);
    this.logger.log(`Core package version: ${corePackageVersion}`);
    this.projectDirPath = path.dirname(info.project.getProjectName());
    this.logger.log(`Project path: ${this.projectDirPath}`);
    this.snapshotManager = new SnapshotManager(this.ts, this.logger);

    const languageServiceHost = {} as Partial<ts.LanguageServiceHost>;
    const languageServiceHostProxy = new Proxy(info.languageServiceHost, {
      get(target, key: keyof ts.LanguageServiceHost) {
        return languageServiceHost[key] ?? target[key];
      }
    });
    const languageService = this.ts.createLanguageService(languageServiceHostProxy);

    languageServiceHost.getScriptKind = getScriptKindHandler.bind(this);
    languageServiceHost.getScriptSnapshot = getScriptSnapshotHandler.bind(this);

    languageService.getQuickInfoAtPosition = getQuickInfoAtPositionHandler.bind(this);

    resolveModuleName.call(this);

    return languageService;

    function getQuickInfoAtPositionHandler(
      this: TypeZenPlugin,
      filePath: string,
      position: number
    ) {
      this.logger.log(`[getQuickInfoAtPosition]: ${filePath}`);

      const tzenDefinitionInfo = this.utils.getTzenDefinitionAtCurPos(
        filePath,
        position,
        info
      );

      if (tzenDefinitionInfo) {
        const quickInfo = this.snapshotManager
          .getOrCreate(tzenDefinitionInfo.filePath)
          .getQuickInfo(
            tzenDefinitionInfo.pos.line + 1,
            tzenDefinitionInfo.pos.character + 1
          );

        if (quickInfo) {
          return quickInfo;
        }
      }

      return info.languageService.getQuickInfoAtPosition(filePath, position);
    }

    function getScriptSnapshotHandler(
      this: TypeZenPlugin,
      filePath: string
    ): ts.IScriptSnapshot | undefined {
      if (this.utils.isTypeZenFile(filePath) && fs.existsSync(filePath)) {
        this.logger.log(`[getScriptSnapshot]: ${filePath}`);
        try {
          return this.snapshotManager.getOrCreate(filePath).getScriptSnapshot();
        } catch (error) {
          this.logger.error(JSON.stringify(error));
        }
      }

      return info.languageServiceHost.getScriptSnapshot(filePath);
    }

    function getScriptKindHandler(this: TypeZenPlugin, filePath: string): ts.ScriptKind {
      if (!info.languageServiceHost.getScriptKind) {
        return this.ts.ScriptKind.Unknown;
      }

      if (this.utils.isTypeZenFile(filePath)) {
        return this.ts.ScriptKind.TS;
      }

      return info.languageServiceHost.getScriptKind(filePath);
    }

    function resolveModuleName(this: TypeZenPlugin) {
      // TypeScript 5.x
      if (info.languageServiceHost.resolveModuleNameLiterals) {
        const _resolveModuleNameLiterals =
          info.languageServiceHost.resolveModuleNameLiterals.bind(
            info.languageServiceHost
          );

        languageServiceHost.resolveModuleNameLiterals = (
          moduleNames,
          containingFile,
          ...rest
        ) => {
          const resolvedModules = _resolveModuleNameLiterals(
            moduleNames,
            containingFile,
            ...rest
          );

          return moduleNames.map(({ text: moduleName }, index) => {
            if (this.utils.isTypeZenFile(moduleName)) {
              return {
                resolvedModule: {
                  extension: this.ts.Extension.Dts,
                  isExternalLibraryImport: false,
                  resolvedFileName: path.resolve(path.dirname(containingFile), moduleName)
                }
              };
            }

            return resolvedModules[index];
          });
        };
      }

      // TypeScript 4.x
      else if (info.languageServiceHost.resolveModuleNames) {
        const _resolveModuleNames = info.languageServiceHost.resolveModuleNames.bind(
          info.languageServiceHost
        );

        languageServiceHost.resolveModuleNames = (
          moduleNames,
          containingFile,
          ...rest
        ) => {
          const resolvedModules = _resolveModuleNames(
            moduleNames,
            containingFile,
            ...rest
          );

          return moduleNames.map((moduleName, index) => {
            if (this.utils.isTypeZenFile(moduleName)) {
              return {
                extension: this.ts.Extension.Dts,
                isExternalLibraryImport: false,
                resolvedFileName: path.resolve(path.dirname(containingFile), moduleName)
              } as ts.ResolvedModuleFull;
            }

            return resolvedModules[index];
          });
        };
      }
    }
  }

  public getExternalFiles(project: ts.server.Project) {
    const tzenFilePaths = project
      .getFileNames()
      .filter(filePath => this.utils.isTypeZenFile(filePath));

    if (!isFirst) {
      return tzenFilePaths;
    }

    if (isFirst) {
      isFirst = false;
      project.projectService.reloadProjects();
    }

    return tzenFilePaths;
  }

  private utils = {
    isTypeZenFile(filePath: string) {
      return filePath.endsWith('.tzen');
    },
    getTzenDefinitionAtCurPos: (
      currentFilePath: string,
      currentPos: number,
      info: ts.server.PluginCreateInfo
    ): { pos: ts.LineAndCharacter; filePath: string } | undefined => {
      const definitionInfos = info.languageService.getDefinitionAtPosition(
        currentFilePath,
        currentPos
      );

      if (definitionInfos) {
        const [definitionInfo] = definitionInfos;

        if (this.utils.isTypeZenFile(definitionInfo.fileName)) {
          const definitionSourceFile = info.project.getSourceFile(
            info.project.projectService.toPath(definitionInfo.fileName)
          );
          const definitionPosition = definitionInfo.textSpan.start;

          if (definitionSourceFile) {
            return {
              pos: this.ts.getLineAndCharacterOfPosition(
                definitionSourceFile!,
                definitionPosition
              ),
              filePath: definitionInfo.fileName
            };
          }
        }
      }
    }
  };
}
