import type ts from 'typescript/lib/tsserverlibrary';

export class Logger {
  constructor(private readonly info: ts.server.PluginCreateInfo) {}

  log(message: string) {
    this.info.project.projectService.logger.info(`[@type-zen/ts-plugin] ${message}`);
  }

  error(message: string) {
    this.info.project.projectService.logger.info(
      `[@type-zen/ts-plugin] Error: ${message}`
    );
  }
}
