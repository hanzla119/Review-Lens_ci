import { test } from "node:test";
import assert from "node:assert";
import { generateOtpCode } from "../utils/otp.js";

test("generateOtpCode returns a 6-digit numeric string", () => {
  const code = generateOtpCode();
  
  // 1. Verify that the output is a string
  assert.strictEqual(typeof code, "string");
  
  // 2. Verify that the length of the string is exactly 6
  assert.strictEqual(code.length, 6);
  
  // 3. Verify that the string contains only numbers
  assert.match(code, /^[0-9]{6}$/);
});
