module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'node_modules',
    'dist',
    'examples',
    'coverage',
    'templates',
  ],
  resetMocks: true,
};
