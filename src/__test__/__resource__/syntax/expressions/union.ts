export { unionTemplate };

const unionTemplate = {
  valid: {
    native: [
      "string | number",
      "string | number | boolean",
      "string | number | boolean | null",
      "string | number | boolean | null | undefined",
      "string | number | boolean | null | undefined | void",
      "string | number | boolean | null | undefined | void | never",
      "string | number | boolean | null | undefined | void | never | unknown",
      "string | number | boolean | null | undefined | void | never | unknown | any",
    ],
    extended: [
      "|[string]",
      '|[string, 1, 3, true, "sss"]',
      "|[string, 1, 3, true, 1| 2 | 3, name<sss>, void, (ss<sd> | ccc | 123)]",
    ],
  },
};
