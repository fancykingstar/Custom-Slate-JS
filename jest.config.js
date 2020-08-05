module.exports = {
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
    },
  },
  moduleNameMapper: {
    '^.+\\.module\\.(scss)$': 'identity-obj-proxy',
    'components/(.*)': '<rootDir>/components/$1',
    'pages/(.*)': '<rootDir>/pages/$1',
    'styles/(.*)': '<rootDir>/styles/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(scss)$'],
};
