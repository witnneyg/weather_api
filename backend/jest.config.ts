import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testTimeout: 999999,
  setupFiles: ["<rootDir>/jest.setup.ts"],
};

export default config;
