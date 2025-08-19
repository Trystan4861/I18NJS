/**
 * Setup después del entorno para Jest
 * Configuración de JSDOM y utilidades de testing
 */

import { JSDOM } from 'jsdom';

// Configurar JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Configurar variables globales
global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;

// Setup para cada test
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