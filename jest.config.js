module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/tests/**/*.test.js'],
    testTimeout: 10000,
    verbose: true,
};
