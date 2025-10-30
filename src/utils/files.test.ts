import { describe, expect, it } from "vitest";

import { extractFileExtension } from "./files.js";

describe("extractFileExtension", () => {
  it("returns extension after the final dot", () => {
    expect(extractFileExtension("document.pdf")).toBe("pdf");
  });

  it("returns the filename when no dot is present", () => {
    expect(extractFileExtension("LICENSE")).toBe("LICENSE");
  });

  it("returns an empty string for filenames ending with a dot", () => {
    expect(extractFileExtension("note.")).toBe("");
  });

  it("returns the last segment for filenames with multiple dots", () => {
    expect(extractFileExtension("archive.tar.gz")).toBe("gz");
  });
});
