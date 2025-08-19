/**
 * Utilidades y helpers para tests de I18NJS
 * Autor: @trystan4861
 */

import { TranslationDataset } from '../../src/types/i18n.types';

/**
 * Crea un dataset de traducciones de prueba
 */
export function createMockTranslations(): TranslationDataset {
  return {
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
}

/**
 * Crea elementos HTML de prueba
 */
export function createTestElements(): HTMLElement[] {
  const elements = [
    createElement('div', 'simple', 'Original Simple'),
    createElement('span', 'form.name', 'Original Name'),
    createElement('p', 'nested.level1.level2', 'Original Nested'),
    createElement('input', 'form.email', '', 'placeholder')
  ];
  
  elements.forEach(el => document.body.appendChild(el));
  return elements;
}

/**
 * Crea un elemento HTML con data-i18n-key
 */
export function createElement(
  tag: string, 
  key: string, 
  content: string, 
  attribute: 'textContent' | 'placeholder' | 'value' = 'textContent'
): HTMLElement {
  const element = document.createElement(tag);
  element.setAttribute('data-i18n-key', key);
  
  if (attribute === 'textContent') {
    element.textContent = content;
  } else if (attribute === 'placeholder' && element instanceof HTMLInputElement) {
    element.placeholder = content;
  } else if (attribute === 'value' && element instanceof HTMLInputElement) {
    element.value = content;
  }
  
  return element;
}

/**
 * Limpia el DOM completamente
 */
export function cleanDOM(): void {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  document.documentElement.lang = '';
}

/**
 * Simula un cambio de idioma en el documento
 */
export function setDocumentLanguage(lang: string): void {
  document.documentElement.lang = lang;
}

/**
 * Obtiene todos los elementos con data-i18n-key
 */
export function getTranslatableElements(): NodeListOf<Element> {
  return document.querySelectorAll('[data-i18n-key]');
}

/**
 * Verifica que un elemento tenga la traducción correcta
 */
export function expectElementTranslation(
  element: HTMLElement, 
  expectedText: string, 
  expectedLang?: string
): void {
  expect(element.textContent?.trim()).toBe(expectedText);
  
  if (expectedLang) {
    expect(element.getAttribute('data-i18n-lang')).toBe(expectedLang);
  }
}

/**
 * Verifica que un input tenga el placeholder correcto
 */
export function expectInputPlaceholder(
  input: HTMLInputElement, 
  expectedPlaceholder: string, 
  expectedLang?: string
): void {
  expect(input.placeholder).toBe(expectedPlaceholder);
  
  if (expectedLang) {
    expect(input.getAttribute('data-i18n-lang')).toBe(expectedLang);
  }
}

/**
 * Crea un dataset de traducciones grande para tests de performance
 */
export function createLargeTranslationDataset(
  languages: string[] = ['es', 'en', 'fr'], 
  keysPerLanguage: number = 1000
): TranslationDataset {
  const dataset: TranslationDataset = {};
  
  languages.forEach(lang => {
    dataset[lang] = {};
    
    for (let i = 0; i < keysPerLanguage; i++) {
      dataset[lang][`key_${i}`] = `Translation ${i} in ${lang}`;
      
      // Agregar algunas claves anidadas
      if (i % 10 === 0) {
        dataset[lang][`nested_${i}`] = {
          level1: `Nested ${i} level 1 in ${lang}`,
          level2: {
            deep: `Deep nested ${i} in ${lang}`
          }
        };
      }
    }
  });
  
  return dataset;
}

/**
 * Mide el tiempo de ejecución de una función
 */
export async function measureExecutionTime<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; time: number }> {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  
  return {
    result,
    time: endTime - startTime
  };
}

/**
 * Crea múltiples elementos DOM para tests de performance
 */
export function createManyElements(count: number, key: string = 'test.key'): HTMLElement[] {
  const elements: HTMLElement[] = [];
  
  for (let i = 0; i < count; i++) {
    const element = document.createElement('div');
    element.setAttribute('data-i18n-key', key);
    element.textContent = `Original text ${i}`;
    document.body.appendChild(element);
    elements.push(element);
  }
  
  return elements;
}

/**
 * Verifica que todos los elementos tengan el mismo idioma
 */
export function expectAllElementsHaveLanguage(lang: string): void {
  const elements = getTranslatableElements();
  elements.forEach(element => {
    expect(element.getAttribute('data-i18n-lang')).toBe(lang);
  });
}

/**
 * Simula un formulario complejo para tests de integración
 */
export function createComplexForm(): HTMLFormElement {
  const form = document.createElement('form');
  form.innerHTML = `
    <div class="field">
      <label data-i18n-key="form.labels.name">Name</label>
      <input type="text" data-i18n-key="form.placeholders.name" placeholder="Enter name">
    </div>
    <div class="field">
      <label data-i18n-key="form.labels.email">Email</label>
      <input type="email" data-i18n-key="form.placeholders.email" placeholder="Enter email">
    </div>
    <div class="field">
      <label data-i18n-key="form.labels.message">Message</label>
      <textarea data-i18n-key="form.placeholders.message" placeholder="Enter message"></textarea>
    </div>
    <div class="buttons">
      <button type="submit" data-i18n-key="form.buttons.submit">Submit</button>
      <button type="button" data-i18n-key="form.buttons.cancel">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(form);
  return form;
}

/**
 * Datos de traducción para formulario complejo
 */
export function getFormTranslations(): TranslationDataset {
  return {
    es: {
      form: {
        labels: {
          name: 'Nombre',
          email: 'Correo',
          message: 'Mensaje'
        },
        placeholders: {
          name: 'Ingresa tu nombre',
          email: 'Ingresa tu correo',
          message: 'Ingresa tu mensaje'
        },
        buttons: {
          submit: 'Enviar',
          cancel: 'Cancelar'
        }
      }
    },
    en: {
      form: {
        labels: {
          name: 'Name',
          email: 'Email',
          message: 'Message'
        },
        placeholders: {
          name: 'Enter your name',
          email: 'Enter your email',
          message: 'Enter your message'
        },
        buttons: {
          submit: 'Submit',
          cancel: 'Cancel'
        }
      }
    }
  };
}