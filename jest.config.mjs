export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov', 'clover'],
  verbose: true,
  testMatch: ['**/*.test.js'],
  // Minimum test coverage requirements
  coverageThreshold: {
      global: {
          branches: 70,
          functions: 70,
          lines:70,
          statements: 70
      }
  },
};