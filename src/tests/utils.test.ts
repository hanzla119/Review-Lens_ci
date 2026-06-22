import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("cn utility", () => {
  it("should combine class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("should resolve tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
