/**
 * Tests simples para la clase I18n
 * Autor: @trystan4861
 */

import { I18n } from '../../src/I18n';
import { TranslationDataset } from '../../src/types/i18n.types';

// Mock del DOM más completo
const mockElement = {
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
  textContent: '',
  tagName: 'DIV'
};

const mockDocument = {
  documentElement: { lang: 'es' },
  querySelectorAll: jest.fn(() => []),
  querySelector: jest.fn(() => null)
};

// @ts-ignore
global.document = mockDocument;

describe('I18n Simple Tests', () => {
  let i18n: I18n;
  let mockTranslations: TranslationDataset;

  beforeEach(() => {
    i18n = new I18n();
    mockTranslations = {
      es: {
        simple: 'Hola',
        nested: {
          level1: {
            level2: 'Anidado profundo'
          }
        },
        form: {
          name: 'Nombre',
          email: 'Correo'
        }
      },
      en: {
        simple: 'Hello',
        nested: {
          level1: {
            level2: 'Deep nested'
          }
        },
        form: {
          name: 'Name',
          email: 'Email'
        }
      },
      fr: {
        simple: 'Bonjour',
        nested: {
          level1: {
            level2: 'Imbriqué profond'
          }
        },
        form: {
          name: 'Nom',
          email: 'Email'
        }
      }
    };
    
    // Reset mocks
    jest.clearAllMocks();
    mockDocument.documentElement.lang = 'es';
  });

  describe('Constructor', () => {
    it('should create instance with default language', () => {
      expect(i18n).toBeInstanceOf(I18n);
      expect(i18n.defaultLang).toBe('es');
    });

    it('should create instance with custom default language', () => {
      const customI18n = new I18n('en');
      expect(customI18n.defaultLang).toBe('en');
    });
  });

  describe('loadTranslations()', () => {
    it('should load translations correctly', () => {
      i18n.loadTranslations(mockTranslations);
      expect(i18n.translations).toEqual(mockTranslations);
    });

    it('should overwrite existing translations', () => {
      i18n.loadTranslations({ es: { test: 'prueba' } });
      i18n.loadTranslations(mockTranslations);
      expect(i18n.translations).toEqual(mockTranslations);
    });
  });

  describe('getLanguages()', () => {
    beforeEach(() => {
      i18n.loadTranslations(mockTranslations);
    });

    it('should return array of available languages', () => {
      const languages = i18n.getLanguages();
      expect(languages).toEqual(['es', 'en', 'fr']);
    });

    it('should return empty array when no translations loaded', () => {
      const emptyI18n = new I18n();
      expect(emptyI18n.getLanguages()).toEqual([]);
    });
  });

  describe('getTranslation()', () => {
    beforeEach(() => {
      i18n.loadTranslations(mockTranslations);
    });

    it('should get simple translation', () => {
      const result = i18n.getTranslation({ key: 'simple', lang: 'es' });
      expect(result).toBe('Hola');
    });

    it('should get nested translation', () => {
      const result = i18n.getTranslation({ key: 'nested.level1.level2', lang: 'en' });
      expect(result).toBe('Deep nested');
    });

    it('should return key when translation not found', () => {
      const result = i18n.getTranslation({ key: 'nonexistent', lang: 'es' });
      expect(result).toBe('nonexistent');
    });

    it('should return key when language not found', () => {
      const result = i18n.getTranslation({ key: 'simple', lang: 'de' });
      expect(result).toBe('simple');
    });

    it('should handle deeply nested keys', () => {
      const result = i18n.getTranslation({ key: 'form.name', lang: 'en' });
      expect(result).toBe('Name');
    });

    it('should return key for partial nested path', () => {
      const result = i18n.getTranslation({ key: 'nested.level1', lang: 'es' });
      expect(result).toBe('nested.level1');
    });
  });

  describe('getCurrentLang()', () => {
    it('should return default language when document lang is empty', () => {
      mockDocument.documentElement.lang = '';
      expect(i18n.getCurrentLang()).toBe('es');
    });

    it('should return custom default language', () => {
      const customI18n = new I18n('en');
      mockDocument.documentElement.lang = '';
      expect(customI18n.getCurrentLang()).toBe('en');
    });
  });

  describe('setDefaultLang()', () => {
    it('should set default language', () => {
      i18n.setDefaultLang('fr');
      expect(i18n.defaultLang).toBe('fr');
    });

    it('should affect getCurrentLang when document lang is empty', () => {
      mockDocument.documentElement.lang = '';
      i18n.setDefaultLang('en');
      expect(i18n.getCurrentLang()).toBe('en');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty translation object', () => {
      i18n.loadTranslations({});
      expect(i18n.getLanguages()).toEqual([]);
    });

    it('should handle malformed nested keys', () => {
      i18n.loadTranslations(mockTranslations);
      
      const result = i18n.getTranslation({ key: 'nested..level1', lang: 'es' });
      expect(result).toBe('nested..level1');
    });

    it('should handle circular references safely', () => {
      const circularTranslations: any = {
        es: {
          test: 'value'
        }
      };
      // Create circular reference
      circularTranslations.es.circular = circularTranslations.es;
      
      expect(() => i18n.loadTranslations(circularTranslations)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle large translation datasets', () => {
      const largeTranslations: TranslationDataset = {};
      const languages = ['es', 'en', 'fr'];
      
      languages.forEach(lang => {
        largeTranslations[lang] = {};
        for (let i = 0; i < 100; i++) {
          largeTranslations[lang][`key_${i}`] = `Translation ${i} in ${lang}`;
        }
      });
      
      const startTime = performance.now();
      i18n.loadTranslations(largeTranslations);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50); // Menos de 50ms
      expect(i18n.getLanguages()).toHaveLength(3);
    });

    it('should retrieve translations quickly', () => {
      i18n.loadTranslations(mockTranslations);
      
      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        i18n.getTranslation({ key: 'simple', lang: 'es' });
        i18n.getTranslation({ key: 'nested.level1.level2', lang: 'en' });
        i18n.getTranslation({ key: 'form.name', lang: 'fr' });
      }
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(20); // Menos de 20ms para 300 traducciones
    });
  });

  describe('API Consistency', () => {
    beforeEach(() => {
      i18n.loadTranslations(mockTranslations);
    });

    it('should maintain consistent API responses', () => {
      // Múltiples llamadas deberían devolver el mismo resultado
      const key = 'simple';
      const lang = 'es';
      
      const result1 = i18n.getTranslation({ key, lang });
      const result2 = i18n.getTranslation({ key, lang });
      const result3 = i18n.getTranslation({ key, lang });
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe('Hola');
    });

    it('should handle language switching consistently', () => {
      const key = 'simple';
      
      expect(i18n.getTranslation({ key, lang: 'es' })).toBe('Hola');
      expect(i18n.getTranslation({ key, lang: 'en' })).toBe('Hello');
      expect(i18n.getTranslation({ key, lang: 'fr' })).toBe('Bonjour');
      expect(i18n.getTranslation({ key, lang: 'es' })).toBe('Hola'); // Volver al español
    });

    it('should maintain state correctly', () => {
      expect(i18n.defaultLang).toBe('es');
      
      i18n.setDefaultLang('en');
      expect(i18n.defaultLang).toBe('en');
      
      i18n.setDefaultLang('fr');
      expect(i18n.defaultLang).toBe('fr');
      
      // Las traducciones no deberían cambiar
      expect(i18n.getLanguages()).toEqual(['es', 'en', 'fr']);
    });
  });
});