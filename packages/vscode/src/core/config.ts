import type { ReadonlyDeep } from 'type-fest';
import * as vscode from 'vscode';

import { log } from './log';

interface ExtensionConfig {
  /**
   * @default true
   */
  enabled: boolean;
  newTypeZenFile: {
    /**
     * @default true
     */
    autoCompile: boolean;
  };
  compile: {
    /**
     * @default 'console'
     */
    outputTo: 'console';
  };
}

export class Config {
  private static _instance: Config;
  /** instance */
  public static get i(): Config {
    return (Config._instance ??= new Config());
  }

  private _config: ExtensionConfig;

  private constructor() {
    this._initConfig();
    this._watchConfig();
  }

  public update() {
    this._initConfig();
    log.default.appendLine(`Config updated:
    ${JSON.stringify(this._config, null, 2)}
    `);
  }

  public get(): ReadonlyDeep<ExtensionConfig> {
    return this._config;
  }

  private _initConfig() {
    const config = vscode.workspace.getConfiguration('typezen');

    this._config = Object.freeze({
      enabled: config.get('enabled', true),
      newTypeZenFile: {
        autoCompile: config.get('newTypeZenFile.autoCompile', true)
      },
      compile: {
        outputTo: config.get<any>('compile.outputTo', 'console')
      }
    });
  }

  private _watchConfig() {
    vscode.workspace.onDidChangeConfiguration(() => {
      this.update();
    });
  }
}
