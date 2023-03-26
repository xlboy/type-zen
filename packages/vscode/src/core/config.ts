import { O } from 'ts-toolbelt';
import type { ReadonlyDeep } from 'type-fest';
import * as vscode from 'vscode';

import { log } from './log';

interface ExtensionConfig {
  /**
   * @default true
   */
  enabled: boolean;
  // untitledFile: {
  //   /**
  //    * @default true
  //    */
  //   autoCompile: boolean;
  // };
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

  private config: ExtensionConfig;

  private constructor() {
    this.init();
    this.watch();
  }

  public update() {
    this.init();
    log.default.appendLine(`Config updated:
${JSON.stringify(this.config, null, 2)}
`);
  }

  public get(): ReadonlyDeep<ExtensionConfig> {
    return this.config;
  }

  private init() {
    const config = vscode.workspace.getConfiguration('typezen');

    this.config = Object.freeze<ExtensionConfig>({
      enabled: config.get('enabled', true),
      // untitledFile: {
      //   autoCompile: config.get('untitledFile.autoCompile', true)
      // },
      compile: {
        outputTo: config.get<any>('compile.outputTo', 'console')
      }
    });
  }

  private watch() {
    vscode.workspace.onDidChangeConfiguration(() => {
      this.update();
    });
  }
}
