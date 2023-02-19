export { conditionTemplate };

const conditionTemplate = {
  valid: {
    native: [
      "true extends false ? true : false",
      "123 extends 121 ? (1) : 2 extends 2 ? (3) : 4",
      "998 extends 1 ? boolean extends c<ddd> ? (1) : 2 extends 2 ? (3) : 4 : (1 | 2 | didi<dd>)",
    ],
    extended: [
      "123 == 121 ? 1 : 2 == 2 ? 3 : 4",
      "(123 == 121 ? 1 : 2) == 2 ? 3 : 4",
      '123 == 121 ? 1 : 2 == 2 ? 3 : 4 | 1 | true | "sss"',
    ],
  },
};
