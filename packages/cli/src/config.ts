import fs from 'node:fs';
import path from 'node:path';

import { mergeWith } from 'lodash-es';
import type { O } from 'ts-toolbelt';
import { createConfigLoader as createLoader } from 'unconfig';

export { defineConfig, loadConfig, defaultConfig, type TypeZenConfig };

interface TypeZenConfig {
  include?: {
    // ts?: string[];
    tzen?: string[];
  };
  exclude?: {
    // ts?: string[];
    tzen?: string[];
  };
}

function defineConfig(config: TypeZenConfig) {
  return config;
}

type InnerTypeZenConfig = O.Required<TypeZenConfig, string, 'deep'>;
const defaultConfig: InnerTypeZenConfig = Object.freeze({
  include: {
    // ts: ['**/*.ts', '**/*.tsx'],
    tzen: ['**/*.tzen']
  },
  exclude: {
    // ts: ['**/node_modules/**', '**/.git/**'],
    tzen: ['**/node_modules/**', '**/.git/**']
  }
});

async function loadConfig(options: {
  cwd: string;
  configPath?: string;
}): Promise<InnerTypeZenConfig> {
  const resolved = path.resolve(options.cwd, options.configPath || '');
  let isFile = false;

  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    isFile = true;
    options.cwd = path.dirname(resolved);
  }

  const loader = createLoader<TypeZenConfig>({
    cwd: options.cwd,
    defaults: {},
    sources: isFile
      ? { files: [resolved], extensions: [] }
      : { files: ['tzen.config', 'typezen.config', 'tz.config'] }
  });

  const config = (await loader.load()).config;

  return mergeWith({}, defaultConfig, config, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return srcValue;
    }
  });
}
