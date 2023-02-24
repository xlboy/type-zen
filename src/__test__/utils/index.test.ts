import { describe, expect, it } from "vitest";
import { permuteObjects } from ".";

describe("permuteObjects", () => {
  const obj = { a: { a: 1 }, b: { b: 2 }, c: { c: 3 }, d: { d: 4 } };

  it("Unlimited minimum length", () => {
    const result = permuteObjects([obj.a, obj.b, obj.c]);
    expect(result).toMatchObject([
      [obj.a],
      [obj.a, obj.b],
      [obj.a, obj.b, obj.c],
      [obj.a, obj.c],
      [obj.a, obj.c, obj.b],
      [obj.b],
      [obj.b, obj.a],
      [obj.b, obj.a, obj.c],
      [obj.b, obj.c],
      [obj.b, obj.c, obj.a],
      [obj.c],
      [obj.c, obj.a],
      [obj.c, obj.a, obj.b],
      [obj.c, obj.b],
      [obj.c, obj.b, obj.a],
    ]);
  });

  it("Minimum length 2", () => {
    const result = permuteObjects([obj.a, obj.b, obj.c], 2);
    expect(result).toMatchObject([
      [obj.a, obj.b],
      [obj.a, obj.b, obj.c],
      [obj.a, obj.c],
      [obj.a, obj.c, obj.b],
      [obj.b, obj.a],
      [obj.b, obj.a, obj.c],
      [obj.b, obj.c],
      [obj.b, obj.c, obj.a],
      [obj.c, obj.a],
      [obj.c, obj.a, obj.b],
      [obj.c, obj.b],
      [obj.c, obj.b, obj.a],
    ]);
  });

  it("Minimum length 2, maximum length 3", () => {
    const result = permuteObjects([obj.a, obj.b, obj.c, obj.d], 2, 3);

    expect(result).toMatchObject([
      [obj.a, obj.b],
      [obj.a, obj.b, obj.c],
      [obj.a, obj.b, obj.d],
      [obj.a, obj.c],
      [obj.a, obj.c, obj.b],
      [obj.a, obj.c, obj.d],
      [obj.a, obj.d],
      [obj.a, obj.d, obj.b],
      [obj.a, obj.d, obj.c],
      [obj.b, obj.a],
      [obj.b, obj.a, obj.c],
      [obj.b, obj.a, obj.d],
      [obj.b, obj.c],
      [obj.b, obj.c, obj.a],
      [obj.b, obj.c, obj.d],
      [obj.b, obj.d],
      [obj.b, obj.d, obj.a],
      [obj.b, obj.d, obj.c],
      [obj.c, obj.a],
      [obj.c, obj.a, obj.b],
      [obj.c, obj.a, obj.d],
      [obj.c, obj.b],
      [obj.c, obj.b, obj.a],
      [obj.c, obj.b, obj.d],
      [obj.c, obj.d],
      [obj.c, obj.d, obj.a],
      [obj.c, obj.d, obj.b],
      [obj.d, obj.a],
      [obj.d, obj.a, obj.b],
      [obj.d, obj.a, obj.c],
      [obj.d, obj.b],
      [obj.d, obj.b, obj.a],
      [obj.d, obj.b, obj.c],
      [obj.d, obj.c],
      [obj.d, obj.c, obj.a],
      [obj.d, obj.c, obj.b],
    ]);
  });
});
