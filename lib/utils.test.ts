import assert from "node:assert";
import { test } from "node:test";

import { requireEnvVar, stringToColor } from "./utils";

test("stringToColor returns deterministic hex color for identical inputs", () => {
  const color1 = stringToColor("Alice");
  const color2 = stringToColor("Alice");
  assert.strictEqual(color1, color2);
  assert.strictEqual(color1, "#BE123C");
});

test("stringToColor returns valid hex color format", () => {
  const color = stringToColor("Bob");
  assert.match(color, /^#[0-9A-Fa-f]{6}$/);
});

test("stringToColor handles empty string gracefully", () => {
  const color = stringToColor("");
  assert.match(color, /^#[0-9A-Fa-f]{6}$/);
});

test("requireEnvVar returns the environment variable value when set", function testRequireEnvVarSet() {
  process.env.TEST_VAR = "test-value";
  assert.strictEqual(requireEnvVar("TEST_VAR"), "test-value");
  delete process.env.TEST_VAR;
});

test("requireEnvVar throws an error when environment variable is not set", function testRequireEnvVarMissing() {
  delete process.env.NON_EXISTENT_VAR;
  assert.throws(
    function callRequireEnvVarMissing() {
      requireEnvVar("NON_EXISTENT_VAR");
    },
    /NON_EXISTENT_VAR is not set in environment variables/,
  );
});

test("requireEnvVar throws an error when environment variable is empty string", function testRequireEnvVarEmpty() {
  process.env.EMPTY_VAR = "";
  assert.throws(
    function callRequireEnvVarEmpty() {
      requireEnvVar("EMPTY_VAR");
    },
    /EMPTY_VAR is not set in environment variables/,
  );
  delete process.env.EMPTY_VAR;
});
