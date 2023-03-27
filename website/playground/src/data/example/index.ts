import { basicExample } from './basic';
import { sugarExample } from './sugar-block';
import { typeChallengesExample } from './type-challenges';
import type { Example, ExampleKey } from './types';

export { examples, findExampleByKey, defaultPresetTSCode };
export type { ExampleKey, Example };

const examples = [basicExample, sugarExample, typeChallengesExample] as const;

// 对应上 @type-zen/preset-type
const defaultPresetTSCode = `
//#region  //*=========== preset code ===========
// @ts-ignore
const _typeZenUnreturnSymbol: unique symbol = Symbol();

/** TypeZen Unreturned Symbol */
type TZ_URS = typeof _typeZenUnreturnSymbol;
//#endregion  //*======== preset code ===========
`;

function findExampleByKey(
  key: string,
  children: ReadonlyArray<Example.Index> = examples
): Example.Item | undefined {
  for (const item of children) {
    if ('children' in item) {
      const result = findExampleByKey(key, item.children);

      if (result) {
        return result;
      }
    } else {
      if (item.key === key) {
        return item;
      }
    }
  }
}
