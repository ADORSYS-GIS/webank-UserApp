/* eslint-disable */
export default {
    displayName: 'contact-service',
    testEnvironment: 'node',
    preset: 'ts-jest',
    transform: {
        '^.+\\.[jt]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
    coverageDirectory: '../../coverage/libs/contact-service',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',  // Matches all test files in __tests__ directory
        '**/?(*.)+(spec|test).[tj]s?(x)' // Matches files ending with .spec.ts, .spec.js, .test.ts, .test.js
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // You can include other directories to ignore if needed
  };
  
  
  
  
  
  
  
  