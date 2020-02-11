module.exports = {
  roots: [
    '<rootDir>/packages',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFiles: [
    '<rootDir>/packages/_docs/test.setup.js',
  ],
}
