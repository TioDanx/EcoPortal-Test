/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@mui|@mui/material|@mui/system|@mui/utils|@emotion/react|@emotion/styled)/)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
