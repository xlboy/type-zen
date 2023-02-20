import * as utils from "../../utils";
import * as ast from "../../../../ast";

export { Identifier };

namespace Identifier {
  export const template = {
    valid: [
      "name",
      "oYccTok3tA_CjEKQNUn4uZc2ChaDi$C99GlGDZHCUVSLYAcTIX38FbSEjldH8",
      "s51LggxsXOK1Ztw_iVOBrywl0KHgnJ8LeZ2QJOuv2jHwMSU2Q",
      "LFnqB$u3u2Jt7tc2PxclQ_EYx$0Ia7ri4RW2vOyc8BOSwDaEsz3e84JW1ntN8f04Ir6rs",
      "RVHJgElY7IMa0rP9ubjahiKzDW2Ey3jJeSvZM1oIzWABwSg",
      "eg9xKgLDDkge8qGx_bBz$fyxpDqtTwVHfM8Q5HCBadJsD8LP0LuZQniP5W3smcaQr3qtWsF7",
      "QgZDIA9G5h2A0jYEoBoTlfFGV3F9",
      "eXUU6484P0tjUSWam3M9Lkbj2HkoTutdWE5HIMTO_Wa7ltEeR",
      "ssT0utkp1VEca1BprzJJb5vNPJgz$LOnJpns79wV8zrM8PWnrjw0EkdKInfNl7JsLu$p3",
      "LyHBWPgGMVh4iXMSKHvekuLIOvRkRWNHSPtMq2rqkrKe93JKktINW$bU_67IIKIW",
      "wXR$QU4l$sMLAOmkvAEv",
      "asuiVBcQrQehVfsQowi4WkALblv3hWw",
      "gQ$AdCtdFHLtyNKrX2yzJ_LgDCrr2D6fy",
      "OvqckARsLPIx2Xt$CS0en5HjiQ2T_63ru42Gk$Hl4tMvD31FUVAmcKr2QltCqaJcN51RZFmVID_Mw5pr9I4o29TtrUfTdL$tUMEa",
      "Tkyo3UbaGjsgSQcAh6eqw8hbAVYu0yf69ScJhPCpNcZ554M5g",
      "u77S4Qw4EcXXeR6NGmvuWY",
      "mEGJh28iU9ND8ESIbvwpSmD8O1$6E$NA10sXEiiNlJ$zFTP7doe5KhSmhQQOccmpVoVOrEy2XkxO7o",
      "WDQ2SyynXd6zztx",
      "ias_Jzy6YpQ2FdSqlXfPovh58lK60Fqkv9jIWpog",
      "o",
      "xGFkEqLubKtizJOZas1B2wyKXH1Q7TfFFN8frSDtWHMGxANJa",
      "$",
      "___$1",
    ],

    invalid: [
      "1name",
      "-f123",
      "#df",
      "1",
      "1.1",
      "1.1.1",
      "*sdfsdf",
      "sdfsdf*",
      "sdf'",
      "jjjsdf;",
      "sdf,",
      "sdf.",
      "sdf?",
    ],
  };

  export const nodes = [
    ...template.valid.map((id) =>
      utils.createSource({
        content: `type ${id} = 111;`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: id,
            }),
            value: utils.createNode({
              instance: ast.NumberLiteralExpression,
              output: "111",
            }),
          }),
        ],
      })
    ),
  ];
}
