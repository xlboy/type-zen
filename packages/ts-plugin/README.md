# TypeScript Plugin for TypeZen


<p align="center">
  <a href="https://npmjs.com/package/@type-zen/ts-plugin"><img src="https://img.shields.io/npm/v/@type-zen/ts-plugin.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://npmjs.com/package/@type-zen/ts-plugin"><img src="https://img.shields.io/npm/dt/@type-zen/ts-plugin.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@type-zen/ts-plugin"><img src="https://img.shields.io/npm/l/@type-zen/ts-plugin.svg?style=flat-square" alt="License"></a>
</p>


![preview](https://user-images.githubusercontent.com/63690944/229493017-9a114a1c-357d-4db7-9b96-51715a3228b0.png)

English | [简体中文](./README.zh.md)

--- 
## Features

- Use types exported from `*.tzen` files in `*.ts` files

- Show related information when hovering over types exported from `*.tzen` files

- ...in development, stay tuned!

## Installation

```bash
npm install @type-zen/ts-plugin -D
```

## Usage

1. Import the plugin in `tsconfig.json`

    ```json
    {
      "compilerOptions": {
        "plugins": [{ "name": "@type-zen/ts-plugin" }]
      }
    }
    ```

2. Configure your editor

    Set the TypeScript version used in your project to the version in `node_modules/typescript/lib`.
    
    - **VSCode**

        Use the `Select TypeScript version` command to switch TypeScript versions.
    
    - ...
  
## Issues

1. When using `tsc` or other tools to perform *type checking*, the error `Cannot use namespace '...' as a type` is prompted

    **Answer:** This is because `tsc` and other tools do not load plugins during *type checking*, and therefore cannot recognize types exported from `*.tzen` files. For discussions related to this issue, please refer to [TypeScript#16607](https://github.com/microsoft/TypeScript/issues/16607).

    **Solution:** Compile the `*.tzen` files to generate the corresponding type declaration files (`.d.ts` files) before running `tsc` or other tools to perform *type checking*. This way, `tsc` or other tools can recognize the type declarations from `*.tzen` files.

2. When performing certain operations on types exported from `*.tzen` files in `*.ts` files (e.g., finding references, jumping to definitions, etc.), the **associated positions** may not be correct.

    **Answer:** This is due to certain internal mechanisms of TS Server, which still need to be studied in depth... (no solution yet)

## CHANGELOG

[CHANGELOG.md](https://github.com/xlboy/type-zen/blob/master/packages/ts-plugin/CHANGELOG.md)

## License

MIT License © 2023-PRESENT  [xlboy](https://github.com/xlboy)
