module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ["jest-expect-message", "./test/helpers.js"],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"]
};