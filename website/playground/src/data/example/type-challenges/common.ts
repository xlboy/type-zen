export const presetUtilsCode = `
//#region  //*=========== type-challenges utils code ===========
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
type Expect<T extends true> = T
//#endregion  //*======== type-challenges utils code ===========
`;
