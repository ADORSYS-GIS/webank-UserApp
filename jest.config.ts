// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Use jsdom for DOM-related tests
    setupFiles: ["<rootDir>/jest.setup.js"], // Ensure this points to your setup file
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};

export default config;
