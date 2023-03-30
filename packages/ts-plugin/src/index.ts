import type tsModule from 'typescript/lib/tsserverlibrary';

import { TypeZenPlugin } from './plugin';

const init: tsModule.server.PluginModuleFactory = module =>
  new TypeZenPlugin(module.typescript);

// @ts-ignore
export = init;
