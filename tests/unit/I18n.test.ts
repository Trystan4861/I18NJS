/**
 * Tests unitarios para la clase I18n
 * Autor: @trystan4861
 */

import { I18n } from '../../src/I18n';
import { TranslationDataset } from '../../src/types/i18n.types';

describe('I18n Class', () => {
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

  describe('init()', () => {
    it('should initialize with default options', () => {
      expect(() => i18n.init()).not.toThrow();
    });

    it('should initialize with custom language', () => {
      i18n.init({ lang: 'en' });
      expect(document.documentElement.lang).toBe('en');
    });

    it('should set document language', () => {
      i18n.init({ lang: 'fr' });
      expect(document.documentElement.lang).toBe('fr');
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
      document.documentElement.lang = 'fr';
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

  describe('translate()', () => {
    beforeEach(() => {
      i18n.loadTranslations(mockTranslations);
      document.body.innerHTML = `
        <div data-i18n-key="simple">Original</div>
        <span data-i18n-key="form.name">Original Name</span>
        <p data-i18n-key="nested.level1.level2">Original Nested</p>
        <div>No translation key</div>
      `;
    });

    it('should translate all elements with data-i18n-key', () => {
      i18n.translate({ lang: 'es' });
      
      const simpleEl = document.querySelector('[data-i18n-key="simple"]') as HTMLElement;
      const nameEl = document.querySelector('[data-i18n-key="form.name"]') as HTMLElement;
      const nestedEl = document.querySelector('[data-i18n-key="nested.level1.level2"]') as HTMLElement;
      
      expect(simpleEl.textContent).toBe('Hola');
      expect(nameEl.textContent).toBe('Nombre');
      expect(nestedEl.textContent).toBe('Anidado profundo');
    });

    it('should translate specific element', () => {
      const element = document.querySelector('[data-i18n-key="simple"]') as HTMLElement;
      i18n.translate({ element, lang: 'en' });
      
      expect(element.textContent).toBe('Hello');
    });

    it('should set data-i18n-lang attribute', () => {
      i18n.translate({ lang: 'fr' });
      
      const elements = document.querySelectorAll('[data-i18n-key]');
      elements.forEach(el => {
        expect(el.getAttribute('data-i18n-lang')).toBe('fr');
      });
    });

    it('should handle elements without translation', () => {
      document.body.innerHTML = '<div data-i18n-key="nonexistent">Original</div>';
      
      i18n.translate({ lang: 'es' });
      
      const element = document.querySelector('[data-i18n-key="nonexistent"]') as HTMLElement;
      expect(element.textContent).toBe('nonexistent');
    });

    it('should translate input placeholders', () => {
      document.body.innerHTML = '<input data-i18n-key="form.name" placeholder="Original">';
      
      i18n.translate({ lang: 'en' });
      
      const input = document.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Name');
    });

    it('should translate input values', () => {
      document.body.innerHTML = '<input data-i18n-key="form.name" value="Original">';
      
      i18n.translate({ lang: 'en' });
      
      const input = document.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Name');
    });
  });

  describe('getCurrentLang()', () => {
    it('should return document language', () => {
      document.documentElement.lang = 'fr';
      expect(i18n.getCurrentLang()).toBe('fr');
    });

    it('should return default language when document lang is empty', () => {
      document.documentElement.lang = '';
      expect(i18n.getCurrentLang()).toBe('es');
    });

    it('should return custom default language', () => {
      const customI18n = new I18n('en');
      document.documentElement.lang = '';
      expect(customI18n.getCurrentLang()).toBe('en');
    });
  });

  describe('setDefaultLang()', () => {
    it('should set default language', () => {
      i18n.setDefaultLang('fr');
      expect(i18n.defaultLang).toBe('fr');
    });

    it('should affect getCurrentLang when document lang is empty', () => {
      document.documentElement.lang = '';
      i18n.setDefaultLang('en');
      expect(i18n.getCurrentLang()).toBe('en');
    });
  });

  describe('updateMissingLangAttributes()', () => {
    beforeEach(() => {
      document.documentElement.lang = 'en';
      document.body.innerHTML = `
        <div data-i18n-key="simple">Text</div>
        <span data-i18n-key="form.name" data-i18n-lang="es">Nombre</span>
        <p data-i18n-key="nested.level1.level2">Nested</p>
      `;
    });

    it('should add missing data-i18n-lang attributes', () => {
      i18n.updateMissingLangAttributes();
      
      const elements = document.querySelectorAll('[data-i18n-key]');
      elements.forEach(el => {
        expect(el.getAttribute('data-i18n-lang')).toBeTruthy();
      });
    });

    it('should not overwrite existing data-i18n-lang attributes', () => {
      i18n.updateMissingLangAttributes();
      
      const spanEl = document.querySelector('span');
      expect(spanEl?.getAttribute('data-i18n-lang')).toBe('es');
    });

    it('should use current document language', () => {
      document.documentElement.lang = 'fr';
      i18n.updateMissingLangAttributes();
      
      const divEl = document.querySelector('div');
      const pEl = document.querySelector('p');
      
      expect(divEl?.getAttribute('data-i18n-lang')).toBe('fr');
      expect(pEl?.getAttribute('data-i18n-lang')).toBe('fr');
    });
  });

  describe('getStats()', () => {
    beforeEach(() => {
      i18n.loadTranslations(mockTranslations);
      document.documentElement.lang = 'en';
      document.body.innerHTML = `
        <div data-i18n-key="simple">Text</div>
        <span data-i18n-key="form.name">Name</span>
        <p data-i18n-key="nested.level1.level2">Nested</p>
      `;
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
      document.body.innerHTML = '<div data-i18n-key="test">Test</div>';
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
      
      expect(result1).toBe('null');
      expect(result2).toBe('undefined');
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