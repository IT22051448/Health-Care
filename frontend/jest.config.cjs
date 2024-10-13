// jest.config.cjs
const path = require("path");

module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest", // Transpile .js, .jsx, .ts, .tsx files
  },
  testEnvironment: "jsdom", // Set the test environment to jsdom
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"], // Include TypeScript extensions if needed
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Setup file for testing utilities
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Resolve the alias for src directory
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock stylesheets
  },
  globals: {
    // Add any global settings you might need
  },
};
