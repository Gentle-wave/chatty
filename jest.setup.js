// Jest setup file - runs before all tests
require('dotenv').config({ path: '.env.test' });

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Suppress console logs during tests
if (process.env.SUPPRESS_LOGS === 'true') {
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        // Keep error for debugging
        error: console.error,
    };
}

// Increase test timeout for slower environments
jest.setTimeout(10000);
