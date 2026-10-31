const assert = require("node:assert");
const { describe, test } = require("node:test");
const { average } = require("../utils/for_testing");

describe("average", () => {
  test("of one value is the value itself", () => {
    assert.strictEqual(average([1]), 1);
  });

  test("of many values is calculated right", () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5);
  });

  test("of empty array is 0", () => {
    assert.strictEqual(average([]), 0);
  });
});
