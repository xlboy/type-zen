import type { Example } from './types';

export const sugarExample = {
  key: 'sugar',
  name: 'Sugar',
  children: [
    {
      key: 'sugar-local-variable',
      name: 'Local Variable',
      zenCode: `
type Example1 = ^{
  type A = 1;
  type B = 2;
    
  return [A, '-------', B]
}
`
    },
    {
      key: 'sugar-if-else',
      name: 'If Else',
      zenCode: `
type Example1<Name: string = ""> = ^{
  type NameInfoMap = {
    Kai: "Kai, Confident and intelligent.",
    Mia: "Mia, Sophisticated and elegant.",
    Jax: "Jax, Adventurous and fearless.",
  };

  if (Name == '') {
    return 'Why not give me a name?'
  }
  
  if (Name == keyof NameInfoMap) {
    return NameInfoMap[Name]
  }
  
  return [Name, " is a good name"]
};

type Test1 = Example1<"Kai">
type Test2 = Example1<"Mia">
type Test3 = Example1<"Jax">
type Test4 = Example1<"Xlboy">
type Test5 = Example1
`
    },
    {
      key: 'sugar-for',
      name: 'For',
      zenCode: `
type GetTypeName<U> = ^{
  for (infer Item in U) {
   return [Item, ":("]
  }
};

type Test1 = GetTypeName<| ["name", 123123, true, false, {}, () => void]>
`
    }
  ]
} as const satisfies Example.Index;
