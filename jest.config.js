/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   verbose: true,
   moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1',
      '^@docs/(.*)$': '<rootDir>/docs/$1',
      '^@test/(.*)$': '<rootDir>/__test__/$1',
   },
   testMatch: ['**/**/*.test.ts'],
   forceExit: true,
   clearMocks: true,
   resetMocks: true,
   restoreMocks: true,
   resetModules: true,
}
