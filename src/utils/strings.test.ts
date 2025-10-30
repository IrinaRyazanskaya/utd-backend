import { describe, expect, it } from "vitest";

import { isNonEmptyString } from "./strings.js";

describe("isNonEmptyString", () => {
  it("returns true for strings with characters", () => {
    expect(isNonEmptyString("ping")).toBe(true);
  });

  it("returns false for empty strings", () => {
    expect(isNonEmptyString("")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isNonEmptyString(42)).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(undefined)).toBe(false);
  });
});
