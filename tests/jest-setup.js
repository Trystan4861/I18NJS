/**
 * Setup inicial para Jest
 * Configuración de polyfills y globals
 */

const { TextEncoder, TextDecoder } = require('util');

// Polyfills para Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de performance si no existe
if (typeof global.performance === 'undefined') {
  global.performance = {
    now: () => Date.now()
  };
}