import { defineConfig, type Options } from 'tsup';

const commonConfig: Options = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: {
    resolve: true
  },
  outExtension(ctx) {
    const fileSuffix = ctx.format === 'cjs' ? 'js' : 'mjs';

    return {
      js: `.${ctx.options.platform}.${fileSuffix}`
    };
  }
};

export default defineConfig([
  {
    ...commonConfig,
    platform: 'node'
  },
  {
    ...commonConfig,
    platform: 'browser'
  }
]);
