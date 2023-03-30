import fs from 'node:fs';
import path from 'node:path';

import { version as corePackageVersion } from '@type-zen/core/package.json';
import type tsModule from 'typescript/lib/tsserverlibrary';

import { version } from '../package.json';
import { getTSSnapshot } from './helpers/get-ts-snapshot';

export { TypeZenPlugin };

class Logger {
  constructor(private readonly info: tsModule.server.PluginCreateInfo) {}

  public log(message: string) {
    this.info.project.projectService.logger.info(`[@type-zen/ts-plugin] ${message}`);
  }

  public error(message: string) {
    this.info.project.projectService.logger.info(
      `[@type-zen/ts-plugin] Error: ${message}`
    );
  }
}

class TypeZenPlugin implements tsModule.server.PluginModule {
  private readonly ts: typeof tsModule;
  private logger: Logger;
  private projectDirPath!: string;

  constructor(ts: typeof tsModule) {
    this.ts = ts;
  }

  public create(info: tsModule.server.PluginCreateInfo): tsModule.LanguageService {
    this.logger = new Logger(info);
    this.logger.log(`Plugin version: ${version}`);
    this.logger.log(`Core package version: ${corePackageVersion}`);
    this.projectDirPath = path.dirname(info.project.getProjectName());
    this.logger.log(`Project path: ${this.projectDirPath}`);

    const languageServiceHost = {} as Partial<tsModule.LanguageServiceHost>;
    const languageServiceHostProxy = new Proxy(info.languageServiceHost, {
      get(target, key: keyof tsModule.LanguageServiceHost) {
        return languageServiceHost[key] ?? target[key];
      }
    });
    const languageService = this.ts.createLanguageService(languageServiceHostProxy);

    languageServiceHost.getScriptKind = getScriptKindHandler.bind(this);
    languageServiceHost.getScriptSnapshot = getScriptSnapshotHandler.bind(this);

    resolveModuleName.call(this);

    return languageService;

    function getScriptSnapshotHandler(
      this: TypeZenPlugin,
      fileName: string
    ): tsModule.IScriptSnapshot | undefined {
      if (this.utils.isTypeZenFile(fileName) && fs.existsSync(fileName)) {
        this.logger.log(`[ScriptSnapshot]: ${fileName.replace(this.projectDirPath, '')}`);

        return getTSSnapshot(this.ts, fileName);
      }

      return info.languageServiceHost.getScriptSnapshot(fileName);
    }

    function getScriptKindHandler(
      this: TypeZenPlugin,
      fileName: string
    ): tsModule.ScriptKind {
      if (!info.languageServiceHost.getScriptKind) {
        return this.ts.ScriptKind.Unknown;
      }

      if (this.utils.isTypeZenFile(fileName)) {
        return this.ts.ScriptKind.TS;
      }

      return info.languageServiceHost.getScriptKind(fileName);
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
              } as tsModule.ResolvedModuleFull;
            }

            return resolvedModules[index];
          });
        };
      }
    }
  }

  public getExternalFiles(project: tsModule.server.ConfiguredProject) {
    return project.getFileNames().filter(filePath => this.utils.isTypeZenFile(filePath));
  }

  private utils = {
    isTypeZenFile(fileName: string) {
      return fileName.endsWith('.tzen');
    }
  };
}
