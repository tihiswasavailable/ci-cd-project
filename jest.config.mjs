export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov', 'clover'],
  verbose: true,
  collectCoverageFrom: [
    '**/*.js',  // Changed to catch all JS files in any directory
    '!jest.config.mjs',
    '!coverage/**',
    '!node_modules/**',
    '!**/*.config.js'  // Exclude config files
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}