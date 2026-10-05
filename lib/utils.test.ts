import assert from "node:assert";
import { test } from "node:test";

import { getAppUrl, requireEnvVar, stringToColor } from "./utils";

test("stringToColor returns deterministic hex color for identical inputs", function testStringToColorDeterministic() {
  const color1 = stringToColor("Alice");
  const color2 = stringToColor("Alice");
  assert.strictEqual(color1, color2);
  assert.strictEqual(color1, "#BE123C");
});

test("stringToColor returns valid hex color format", function testStringToColorValidFormat() {
  const color = stringToColor("Bob");
  assert.match(color, /^#[0-9A-Fa-f]{6}$/);
});

test("stringToColor handles empty string gracefully", function testStringToColorEmpty() {
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

test("getAppUrl prioritizes NEXT_PUBLIC_APP_URL when present", function testGetAppUrlNextPublicAppUrl() {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const originalProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const originalVercelUrl = process.env.VERCEL_URL;

  process.env.NEXT_PUBLIC_APP_URL = "https://custom-domain.com/";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "project.vercel.app";
  process.env.VERCEL_URL = "preview.vercel.app";

  assert.strictEqual(getAppUrl(), "https://custom-domain.com");

  process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = originalProdUrl;
  process.env.VERCEL_URL = originalVercelUrl;
});

test("getAppUrl uses VERCEL_PROJECT_PRODUCTION_URL when NEXT_PUBLIC_APP_URL is absent", function testGetAppUrlVercelProd() {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const originalProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  delete process.env.NEXT_PUBLIC_APP_URL;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "broadwave-nine.vercel.app/";

  assert.strictEqual(getAppUrl(), "https://broadwave-nine.vercel.app");

  process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = originalProdUrl;
});

test("getAppUrl uses VERCEL_URL when higher priority vars are absent", function testGetAppUrlVercelPreview() {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const originalProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const originalVercelUrl = process.env.VERCEL_URL;

  delete process.env.NEXT_PUBLIC_APP_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  process.env.VERCEL_URL = "broadwave-preview-123.vercel.app";

  assert.strictEqual(getAppUrl(), "https://broadwave-preview-123.vercel.app");

  process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = originalProdUrl;
  process.env.VERCEL_URL = originalVercelUrl;
});

test("getAppUrl falls back to production default or localhost in development", function testGetAppUrlFallback() {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const originalProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const originalVercelUrl = process.env.VERCEL_URL;
  const originalNodeEnv = process.env.NODE_ENV;
  const mutableEnv = process.env as Record<string, string | undefined>;

  delete process.env.NEXT_PUBLIC_APP_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  delete process.env.VERCEL_URL;

  mutableEnv.NODE_ENV = "production";
  assert.strictEqual(getAppUrl(), "https://broadwave-nine.vercel.app");

  mutableEnv.NODE_ENV = "development";
  assert.strictEqual(getAppUrl(), "http://localhost:3000");

  process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = originalProdUrl;
  process.env.VERCEL_URL = originalVercelUrl;
  mutableEnv.NODE_ENV = originalNodeEnv;
});


