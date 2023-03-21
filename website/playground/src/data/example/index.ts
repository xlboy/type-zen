import { basicExample } from './basic';
import { sugarExample } from './sugar-block';
import { typeChallengesExample } from './type-challenges';
import type { Example, ExampleKey } from './types';

export { examples, findExampleByKey, defaultPresetTSCode };
export type { ExampleKey, Example };

const examples = [basicExample, sugarExample, typeChallengesExample] as const;

const defaultPresetTSCode = `
//#region  //*=========== preset code ===========
const unreturnSymbol: unique symbol = Symbol();
type UnreturnedSymbol = typeof unreturnSymbol;
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
