/**
 * Setup para tests de Jest
 * Configuración global para testing de I18NJS
 * Autor: @trystan4861
 */

import { JSDOM } from 'jsdom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills para Node.js
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Configurar JSDOM para simular el DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Configurar variables globales
(global as any).window = dom.window;
(global as any).document = dom.window.document;
(global as any).navigator = dom.window.navigator;
(global as any).HTMLElement = dom.window.HTMLElement;
(global as any).Element = dom.window.Element;

// Mock de console para tests más limpios
(global as any).console = {
  ...console,
  // Silenciar logs durante tests (opcional)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Setup adicional para cada test
beforeEach(() => {
  // Limpiar el DOM antes de cada test
  document.body.innerHTML = '';
  document.documentElement.lang = '';
  
  // Limpiar mocks
  jest.clearAllMocks();
});

// Cleanup después de cada test
afterEach(() => {
  // Limpiar el DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

// Utilidades globales para tests
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTranslation(key: string, value: string): R;
    }
  }
}

// Matcher personalizado para verificar traducciones
expect.extend({
  toHaveTranslation(element: HTMLElement, key: string, expectedText: string) {
    const actualKey = element.getAttribute('data-i18n-key');
    const actualText = element.textContent?.trim();
    
    const pass = actualKey === key && actualText === expectedText;
    
    if (pass) {
      return {
        message: () => `Expected element not to have translation key "${key}" with text "${expectedText}"`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected element to have translation key "${key}" with text "${expectedText}", but got key "${actualKey}" with text "${actualText}"`,
        pass: false
      };
    }
  }
});

export {};