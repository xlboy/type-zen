/*
a-if （"a" == "a")
    b-if ("b" == "b2")
        c-if ("c" == "c2")
            return "c-return"
        else 
            return "c-else-return"
    d-if ("d" == "d2")
        return "d-return"
      
    e-if ("e" == "e")
      return "e-return"
return "最后的 return"
*/

// @ts-ignore
const returnSymbol: unique symbol = Symbol();

type UnreturnedSymbol = typeof returnSymbol;


type Result = (
  "a" extends "a"
    ? (
        (
          "b" extends "b2"
            ? "c" extends "c2"
              ? ["c-return"]
              : [
                  "c-else-return"
                ] /* c-if 如果有 else，则顶上。如没有，则 UnreturnedSymbol */
            : UnreturnedSymbol
        ) extends infer B_C_Rtn /* 因为有同级的 d-if，所以需要 infer 出来看看是否已结束此“域”的游行 */
          ? B_C_Rtn extends UnreturnedSymbol /* 未返回，证明还得处理同级的 d-if */
            ? "d" extends "d2"
              ? ["d-return"]
              : UnreturnedSymbol
            : B_C_Rtn /* 已返回，证明已结束此“域”的游行 */
          : never
      ) extends infer B_C_D_Rtn /* 因为有同级的 e-if，所以需要 infer 出来看看是否已结束此“域”的游行 */
      ? B_C_D_Rtn extends UnreturnedSymbol /* 未返回，证明还得处理同级的 e-if */
        ? "e" extends "e"
          ? ["e-return"]
          : UnreturnedSymbol
        : B_C_D_Rtn /* 已返回，证明已结束此“域”的游行 */
      : never
    : UnreturnedSymbol
) extends infer A_Rtn
  ? A_Rtn extends UnreturnedSymbol
    ? ["最后的 return"]
    : A_Rtn
  : never;

type _ = (
  "a1" extends "a2"
    ? (
        "b1" extends "b2"
          ? "c1" extends "c2"
            ? ["c-return"]
            : UnreturnedSymbol
          : UnreturnedSymbol
      ) extends infer B_C_Rtn
      ? B_C_Rtn extends UnreturnedSymbol
        ? "d1" extends "d2"
          ? ["d-return"]
          : UnreturnedSymbol
        : B_C_Rtn
      : never
    : UnreturnedSymbol
) extends infer A_B_C_D_Rtn
  ? A_B_C_D_Rtn extends UnreturnedSymbol
    ? ["最后的 return"]
    : A_B_C_D_Rtn
  : never;

// 如何根据上面注释块那样的语义逻辑来生成 _ 类型的代码内容？

// const json = [
//   {
//     type: "if",
//     condition: ["a1", "a2"],
//     then: [
//       {
//         type: "if",
//         condition: ["b1", "b2"],
//         then: {
//           type: "if",
//           condition: ["c1", "c2"],
//           then: { type: "return", value: ["c-return"] },
//         },
//       },
//       {
//         type: "if",
//         condition: ["d1", "d2"],
//         then: { type: "return", value: ["d-return"] },
//       },
//     ],
//   },
//   { type: "return" },
// ];
