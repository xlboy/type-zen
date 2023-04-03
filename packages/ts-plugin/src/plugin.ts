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

  create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    this.logger = new Logger(info);
    this.snapshotManager = new SnapshotManager(this.ts, this.logger);
    this.projectDirPath = path.dirname(info.project.getProjectName());

    this.logger.log(`Plugin version: ${version}`);
    this.logger.log(`Core package version: ${corePackageVersion}`);
    this.logger.log(`Project path: ${this.projectDirPath}`);

    const languageServiceHostProxy = new Proxy(info.languageServiceHost, {
      get: (target, key: keyof ts.LanguageServiceHost) => {
        const proxyHandler: Partial<ts.LanguageServiceHost> = {
          getScriptKind: getScriptKindHandler.bind(this),
          getScriptSnapshot: getScriptSnapshotHandler.bind(this),
          resolveModuleNames: getResolveModuleNameHandler.call(this, '4', target) as any,
          resolveModuleNameLiterals: getResolveModuleNameHandler.call(
            this,
            '5',
            target
          ) as any
        };

        return proxyHandler[key] ?? target[key];
      }
    });

    const languageServiceProxy = new Proxy(
      this.ts.createLanguageService(languageServiceHostProxy),
      {
        get: (target, key: keyof ts.LanguageService) => {
          const proxyHandler: Partial<ts.LanguageService> = {
            getQuickInfoAtPosition: getQuickInfoAtPositionHandler.bind(this, target),
            getDefinitionAndBoundSpan: getDefinitionAndBoundSpanHandler.bind(this, target)
          };

          return proxyHandler[key] ?? target[key];
        }
      }
    );

    return languageServiceProxy;

    function getQuickInfoAtPositionHandler(
      this: TypeZenPlugin,
      languageService: ts.LanguageService,
      filePath: string,
      position: number
    ): ts.QuickInfo | undefined {
      const defaultQuickInfo = languageService.getQuickInfoAtPosition(filePath, position);
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

      return defaultQuickInfo;
    }

    // TODO: 目前仅能跳转到 tzen 文件中的头部位置，不能跳转到具体的位置
    function getDefinitionAndBoundSpanHandler(
      this: TypeZenPlugin,
      languageService: ts.LanguageService,
      filePath: string,
      position: number
    ): ts.DefinitionInfoAndBoundSpan | undefined {
      const defaultDIBS = languageService.getDefinitionAndBoundSpan(filePath, position);
      const tzenDefinitionInfo = this.utils.getTzenDefinitionAtCurPos(
        filePath,
        position,
        info
      );

      if (tzenDefinitionInfo) {
        const tzenDIBS = this.snapshotManager
          .getOrCreate(tzenDefinitionInfo.filePath)
          .getDefinitionAndBoundSpan(
            tzenDefinitionInfo.pos.line + 1,
            tzenDefinitionInfo.pos.character + 1
          );

        if (tzenDIBS) {
          return {
            textSpan: defaultDIBS?.textSpan ?? tzenDIBS.textSpan,
            definitions: tzenDIBS.definitions
          };
        }
      }

      return defaultDIBS;
    }

    function getScriptSnapshotHandler(
      this: TypeZenPlugin,
      filePath: string
    ): ts.IScriptSnapshot | undefined {
      if (this.utils.isTzenFile(filePath) && fs.existsSync(filePath)) {
        return this.snapshotManager.getOrCreate(filePath).getScriptSnapshot();
      }

      return info.languageServiceHost.getScriptSnapshot(filePath);
    }

    function getScriptKindHandler(this: TypeZenPlugin, filePath: string): ts.ScriptKind {
      if (!info.languageServiceHost.getScriptKind) {
        return this.ts.ScriptKind.Unknown;
      }

      return this.utils.isTzenFile(filePath)
        ? this.ts.ScriptKind.TS
        : info.languageServiceHost.getScriptKind(filePath);
    }

    function getResolveModuleNameHandler(
      this: TypeZenPlugin,
      version: '5' | '4',
      languageServiceHost: ts.LanguageServiceHost
    ) {
      const createTzenModuleInfo = (moduleName: string, containingFile: string) =>
        ({
          extension: this.ts.Extension.Dts,
          isExternalLibraryImport: false,
          resolvedFileName: path.resolve(path.dirname(containingFile), moduleName)
        } as ts.ResolvedModuleFull);

      return version === '5' ? ts5Handler.bind(this) : ts4Handler.bind(this);

      type TS5Fn = NonNullable<ts.LanguageServiceHost['resolveModuleNameLiterals']>;
      type TS5Args = Parameters<TS5Fn>;
      type TS5Return = ReturnType<TS5Fn>;
      function ts5Handler(this: TypeZenPlugin, ...args: TS5Args): TS5Return {
        if (!languageServiceHost.resolveModuleNameLiterals) return [];
        const [moduleNames, containingFile] = args;
        const defaultResolvedModules = languageServiceHost.resolveModuleNameLiterals(
          ...args
        );

        return moduleNames.map(({ text: moduleName }, index) => {
          if (this.utils.isTzenFile(moduleName)) {
            return { resolvedModule: createTzenModuleInfo(moduleName, containingFile) };
          }

          return defaultResolvedModules[index];
        });
      }

      type TS4Fn = NonNullable<ts.LanguageServiceHost['resolveModuleNames']>;
      type TS4Args = Parameters<TS4Fn>;
      type TS4Return = ReturnType<TS4Fn>;
      function ts4Handler(this: TypeZenPlugin, ...args: TS4Args): TS4Return {
        if (!languageServiceHost.resolveModuleNames) return [];
        const [moduleNames, containingFile] = args;
        const defaultResolvedModules = languageServiceHost.resolveModuleNames(...args);

        return moduleNames.map((moduleName, index) => {
          if (this.utils.isTzenFile(moduleName)) {
            return createTzenModuleInfo(moduleName, containingFile);
          }

          return defaultResolvedModules[index];
        });
      }
    }
  }

  getExternalFiles(project: ts.server.Project) {
    const tzenFilePaths = project
      .getFileNames()
      .filter(filePath => this.utils.isTzenFile(filePath));

    if (!isFirst) {
      return tzenFilePaths;
    }

    if (isFirst) {
      isFirst = false;
      // 如果不采用这种方式（reloadProjects）。在后续工作中（getDefinitionAtPosition, ...），会出现上下文中无 `*.tzen` 文件的情况
      project.projectService.reloadProjects();
    }

    return tzenFilePaths;
  }

  private utils = {
    isTzenFile(filePath: string) {
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

        if (this.utils.isTzenFile(definitionInfo.fileName)) {
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
