module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
    testMatch: ['**/test/**/*.test.js'],
    verbose: true,
};
