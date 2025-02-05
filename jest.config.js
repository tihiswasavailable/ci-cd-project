export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
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
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
      }
  }
};