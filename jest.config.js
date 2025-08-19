/**
 * Configuración de Jest para I18NJS
 * Autor: @trystan4861
 */

module.exports = {
  // Preset para TypeScript
  preset: 'ts-jest',
  
  // Entorno de testing
  testEnvironment: 'jsdom',
  
  // Directorios de tests
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.spec.ts'
  ],
  
  // Archivos a incluir en coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**/*'
  ],
  
  // Directorio de coverage
  coverageDirectory: 'coverage',
  
  // Reportes de coverage
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],
  
  // Umbrales de coverage
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup files
  setupFiles: ['<rootDir>/tests/jest-setup.js'],
  
  // Module name mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true
};