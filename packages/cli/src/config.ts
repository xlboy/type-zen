import fs from 'node:fs';
import path from 'node:path';

import { mergeWith } from 'lodash-es';
import type { O } from 'ts-toolbelt';
import { createConfigLoader as createLoader } from 'unconfig';

export {
  defineConfig,
  loadConfig,
  defaultConfig,
  type TypeZenConfig,
  type InnerTypeZenConfig
};

interface TypeZenConfig {
  compiler?: {
    output?: {
      /**
       *  - 'relative': The output file is in the same directory as the input file.
       * @default 'relative'
       */
      location?: 'relative';
      /**
       * @default 'dts'
       */
      format?: 'dts' | 'ts';
      /**
       * Determines whether to insert `// @ts-nocheck` at the beginning of the file.
       *
       * There might be some type errors caused by "magic compilation" in the generated files,
       *
       * but these errors do not affect the normal use of the actual types.
       * @default false
       */
      ignoreCheck?: boolean;
    };
  };
  include?: {
    // ts?: string[];
    tzen?: string[];
  };
  exclude?: {
    // ts?: string[];
    tzen?: string[];
  };
  watch?: boolean;
}

function defineConfig(config: TypeZenConfig) {
  return config;
}

type InnerTypeZenConfig = O.Required<TypeZenConfig, string, 'deep'>;
const defaultConfig = Object.freeze<InnerTypeZenConfig>({
  compiler: {
    output: {
      format: 'dts',
      ignoreCheck: false,
      location: 'relative'
    }
  },
  include: {
    // ts: ['**/*.ts', '**/*.tsx'],
    tzen: ['**/*.tzen']
  },
  exclude: {
    // ts: ['**/node_modules/**', '**/.git/**'],
    tzen: []
  },
  watch: false
});

async function loadConfig(options: { cwd: string; configPath?: string }) {
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

  const { config, sources } = await loader.load();

  const mergedConfig = mergeWith({}, defaultConfig, config, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return srcValue;
    }
  });

  mergedConfig.exclude.tzen = mergedConfig.exclude.tzen.concat([
    '**/node_modules/**',
    '**/.git/**'
  ]);

  return {
    config: mergedConfig as InnerTypeZenConfig,
    filePath: sources[0] as undefined | string
  };
}
