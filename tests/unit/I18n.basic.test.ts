/**
 * Tests básicos para la clase I18n (sin DOM)
 * Autor: @trystan4861
 */

import { I18n } from '../../src/I18n';
import { TranslationDataset } from '../../src/types/i18n.types';

// Mock básico del DOM
const mockDocument = {
  documentElement: { lang: '' },
  querySelectorAll: jest.fn(() => []),
  querySelector: jest.fn(() => null)
};

// @ts-ignore
global.document = mockDocument;

describe('I18n Basic Tests (No DOM)', () => {
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
    
    // Reset mock
    mockDocument.documentElement.lang = '';
    jest.clearAllMocks();
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

    it('should return languages in correct order', () => {
      const orderedTranslations = { fr: {}, en: {}, es: {} };
      i18n.loadTranslations(orderedTranslations);
      expect(i18n.getLanguages()).toEqual(['fr', 'en', 'es']);
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

    it('should use default language when lang not specified', () => {
      mockDocument.documentElement.lang = 'fr';
      const result = i18n.getTranslation({ key: 'simple' });
      expect(result).toBe('Bonjour');
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
    it('should return document language', () => {
      mockDocument.documentElement.lang = 'fr';
      expect(i18n.getCurrentLang()).toBe('fr');
    });

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

  describe('getStats()', () => {
    beforeEach(() => {
      i18n.loadTranslations(mockTranslations);
      mockDocument.documentElement.lang = 'en';
      
      // Mock querySelectorAll para simular 3 elementos
      mockDocument.querySelectorAll.mockReturnValue([{}, {}, {}]);
    });

    it('should return correct statistics', () => {
      const stats = i18n.getStats();
      
      expect(stats).toEqual({
        totalElements: 3,
        availableLanguages: ['es', 'en', 'fr'],
        totalTranslationKeys: 4, // simple, nested.level1.level2, form.name, form.email
        currentLang: 'en',
        defaultLang: 'es'
      });
    });

    it('should count elements correctly', () => {
      mockDocument.querySelectorAll.mockReturnValue([{}]); // 1 elemento
      const stats = i18n.getStats();
      
      expect(stats.totalElements).toBe(1);
    });

    it('should return empty stats when no translations', () => {
      const emptyI18n = new I18n();
      const stats = emptyI18n.getStats();
      
      expect(stats.availableLanguages).toEqual([]);
      expect(stats.totalTranslationKeys).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty translation object', () => {
      i18n.loadTranslations({});
      expect(i18n.getLanguages()).toEqual([]);
    });

    it('should handle null/undefined keys gracefully', () => {
      i18n.loadTranslations(mockTranslations);
      
      // @ts-ignore - Testing runtime behavior
      const result1 = i18n.getTranslation({ key: null, lang: 'es' });
      // @ts-ignore - Testing runtime behavior
      const result2 = i18n.getTranslation({ key: undefined, lang: 'es' });
      
      expect(result1).toBe(null);
      expect(result2).toBe(null);
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
});