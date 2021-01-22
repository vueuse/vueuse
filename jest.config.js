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
    '<rootDir>/packages/.test/test.setup.js',
  ],
  testURL: 'https://vueuse.js.org',
}
