# TypeScript Plugin for TypeZen

<p align="center">
  <a href="https://npmjs.com/package/@type-zen/ts-plugin"><img src="https://img.shields.io/npm/v/@type-zen/ts-plugin.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://npmjs.com/package/@type-zen/ts-plugin"><img src="https://img.shields.io/npm/dt/@type-zen/ts-plugin.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@type-zen/ts-plugin"><img src="https://img.shields.io/npm/l/@type-zen/ts-plugin.svg?style=flat-square" alt="License"></a>
</p>

![preview](https://user-images.githubusercontent.com/63690944/229493017-9a114a1c-357d-4db7-9b96-51715a3228b0.png)

[English](./README.md) | 简体中文

---

## 特性

- 在 `*.ts` 中使用 `*.tzen` 文件中导出的类型

- 悬停于 `*.tzen` 导出的类型处时，显示相关信息

- ...开发中，敬请期待

## 安装

```bash
npm install @type-zen/ts-plugin -D
```

## 使用

1. 在 `tsconfig.json` 中导入插件

    ```json
    {
      "compilerOptions": {
        "plugins": [{ "name": "@type-zen/ts-plugin" }]
      }
    }
    ```

2. 配置编辑器

    将项目工作区中采用的 TypeScript 版本设置为 `node_modules/typescript/lib` 中的版本。
    
    - **VSCode**

        运行 `Select TypeScript version` 命令来切换 TypeScript 版本。
    
    - ...
  
## 问题

1. 使用 `tsc` 等工具进行*类型检查*时，提示 `Cannot use namespace '...' as a type`

    **答：** 这是因为 `tsc` 等工具进行*类型检查*时不会加载插件，因此无法识别 `*.tzen` 文件中导出的类型。相关问题的讨论请看 [TypeScript#16607](https://github.com/microsoft/TypeScript/issues/16607)。

    **解决办法：** 在 `tsc` 等工具进行*类型检查*前对 `*.tzen` 文件进行相对编译输出（在 `*.tzen` 文件旁编译生成 `*.tzen.d.ts` 文件）。这样 `tsc` 等工具就可以识别出 `*.tzen` 文件对应的类型声名了。

2. 在 `*.ts` 文件中对 `*.tzen` 导出的类型进行某些操作（查找引用、转到定义、...）时，会出现**关联位置**不正确的情况

    **答：** TS Server 内部的一些机制问题，还需深入研究…（尚无解决办法）

## CHANGELOG

[CHANGELOG.md](https://github.com/xlboy/type-zen/blob/master/packages/ts-plugin/CHANGELOG.md)

## License

MIT License © 2023-PRESENT  [xlboy](https://github.com/xlboy)
