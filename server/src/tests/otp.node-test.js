import { test } from "node:test";
import assert from "node:assert";
import { generateOtpCode } from "../utils/otp.js";

test("generateOtpCode returns a 6-digit numeric string", () => {
  const code = generateOtpCode();
  assert.strictEqual(typeof code, "string");
  assert.strictEqual(code.length, 6);
  assert.match(code, /^[0-9]{6}$/);
});
