import type { Config } from 'jest';

const config: Config = {
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/*.test.(ts|tsx|js)"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "clover", "cobertura"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.ts"],
};

export default config;
