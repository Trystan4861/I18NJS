/**
 * Tests para tipos TypeScript de I18NJS
 * Verificación de interfaces y tipos
 * Autor: @trystan4861
 */

import { 
  I18nOptions, 
  TranslateOptions, 
  GetTranslationOptions, 
  TranslationData, 
  TranslationDataset 
} from '../../src/types/i18n.types';

describe('TypeScript Types', () => {
  describe('I18nOptions', () => {
    it('should accept valid I18nOptions', () => {
      const validOptions: I18nOptions[] = [
        {},
        { lang: 'es' },
        { lang: 'en' },
        { lang: 'fr' }
      ];

      validOptions.forEach(options => {
        expect(typeof options).toBe('object');
        if (options.lang) {
          expect(typeof options.lang).toBe('string');
        }
      });
    });

    it('should have optional lang property', () => {
      const options1: I18nOptions = {};
      const options2: I18nOptions = { lang: 'es' };

      expect(options1.lang).toBeUndefined();
      expect(options2.lang).toBe('es');
    });
  });

  describe('TranslateOptions', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test">Test</div>';
    });

    it('should accept valid TranslateOptions', () => {
      const element = document.getElementById('test')!;
      
      const validOptions: TranslateOptions[] = [
        {},
        { lang: 'es' },
        { element },
        { element, lang: 'en' }
      ];

      validOptions.forEach(options => {
        expect(typeof options).toBe('object');
        if (options.lang) {
          expect(typeof options.lang).toBe('string');
        }
        if (options.element) {
          expect(options.element).toBeInstanceOf(HTMLElement);
        }
      });
    });

    it('should have optional properties', () => {
      const options1: TranslateOptions = {};
      const options2: TranslateOptions = { lang: 'es' };
      const options3: TranslateOptions = { element: document.getElementById('test')! };

      expect(options1.lang).toBeUndefined();
      expect(options1.element).toBeUndefined();
      expect(options2.lang).toBe('es');
      expect(options3.element).toBeInstanceOf(HTMLElement);
    });
  });

  describe('GetTranslationOptions', () => {
    it('should require key property', () => {
      const validOptions: GetTranslationOptions[] = [
        { key: 'test' },
        { key: 'test.nested' },
        { key: 'test', lang: 'es' }
      ];

      validOptions.forEach(options => {
        expect(typeof options.key).toBe('string');
        if (options.lang) {
          expect(typeof options.lang).toBe('string');
        }
      });
    });

    it('should have optional lang property', () => {
      const options1: GetTranslationOptions = { key: 'test' };
      const options2: GetTranslationOptions = { key: 'test', lang: 'es' };

      expect(options1.key).toBe('test');
      expect(options1.lang).toBeUndefined();
      expect(options2.lang).toBe('es');
    });
  });

  describe('TranslationData', () => {
    it('should accept nested string values', () => {
      const validData: TranslationData[] = [
        { simple: 'value' },
        { 
          nested: {
            level1: 'value1',
            level2: {
              deep: 'deep value'
            }
          }
        },
        {
          mixed: 'string',
          nested: {
            inner: 'inner value'
          }
        }
      ];

      validData.forEach(data => {
        expect(typeof data).toBe('object');
        
        // Verificar que todos los valores finales sean strings
        const checkValues = (obj: TranslationData): void => {
          Object.values(obj).forEach(value => {
            if (typeof value === 'string') {
              expect(typeof value).toBe('string');
            } else if (typeof value === 'object') {
              checkValues(value as TranslationData);
            }
          });
        };
        
        checkValues(data);
      });
    });

    it('should support deeply nested structures', () => {
      const deepData: TranslationData = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: 'deep value'
              }
            }
          }
        }
      };

      expect(typeof deepData.level1).toBe('object');
      
      // Navegar hasta el valor más profundo
      const level5 = ((((deepData.level1 as TranslationData)
        .level2 as TranslationData)
        .level3 as TranslationData)
        .level4 as TranslationData)
        .level5;
        
      expect(level5).toBe('deep value');
    });
  });

  describe('TranslationDataset', () => {
    it('should accept multiple language datasets', () => {
      const validDatasets: TranslationDataset[] = [
        {
          es: { hello: 'Hola' },
          en: { hello: 'Hello' }
        },
        {
          es: {
            greeting: 'Hola',
            nested: {
              deep: 'Profundo'
            }
          },
          en: {
            greeting: 'Hello',
            nested: {
              deep: 'Deep'
            }
          },
          fr: {
            greeting: 'Bonjour',
            nested: {
              deep: 'Profond'
            }
          }
        }
      ];

      validDatasets.forEach(dataset => {
        expect(typeof dataset).toBe('object');
        
        Object.keys(dataset).forEach(lang => {
          expect(typeof lang).toBe('string');
          expect(typeof dataset[lang]).toBe('object');
        });
      });
    });

    it('should support consistent structure across languages', () => {
      const dataset: TranslationDataset = {
        es: {
          page: {
            title: 'Título',
            subtitle: 'Subtítulo'
          },
          form: {
            name: 'Nombre',
            email: 'Correo'
          }
        },
        en: {
          page: {
            title: 'Title',
            subtitle: 'Subtitle'
          },
          form: {
            name: 'Name',
            email: 'Email'
          }
        }
      };

      // Verificar que ambos idiomas tienen la misma estructura
      const esKeys = Object.keys(dataset.es);
      const enKeys = Object.keys(dataset.en);
      
      expect(esKeys).toEqual(enKeys);
      
      // Verificar estructura anidada
      const esPageKeys = Object.keys(dataset.es.page as TranslationData);
      const enPageKeys = Object.keys(dataset.en.page as TranslationData);
      
      expect(esPageKeys).toEqual(enPageKeys);
    });

    it('should handle empty datasets', () => {
      const emptyDatasets: TranslationDataset[] = [
        {},
        { es: {} },
        { es: {}, en: {}, fr: {} }
      ];

      emptyDatasets.forEach(dataset => {
        expect(typeof dataset).toBe('object');
        
        Object.values(dataset).forEach(langData => {
          expect(typeof langData).toBe('object');
        });
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should work with real-world data structures', () => {
      const realWorldDataset: TranslationDataset = {
        es: {
          app: {
            name: 'Mi Aplicación',
            version: '1.0.0'
          },
          navigation: {
            home: 'Inicio',
            about: 'Acerca de',
            contact: 'Contacto'
          },
          form: {
            fields: {
              name: 'Nombre',
              email: 'Correo',
              message: 'Mensaje'
            },
            validation: {
              required: 'Campo obligatorio',
              email: 'Email inválido',
              minLength: 'Mínimo {min} caracteres'
            },
            buttons: {
              submit: 'Enviar',
              cancel: 'Cancelar',
              reset: 'Limpiar'
            }
          },
          messages: {
            success: 'Operación exitosa',
            error: 'Error en la operación',
            loading: 'Cargando...',
            empty: 'Sin datos'
          }
        },
        en: {
          app: {
            name: 'My Application',
            version: '1.0.0'
          },
          navigation: {
            home: 'Home',
            about: 'About',
            contact: 'Contact'
          },
          form: {
            fields: {
              name: 'Name',
              email: 'Email',
              message: 'Message'
            },
            validation: {
              required: 'Required field',
              email: 'Invalid email',
              minLength: 'Minimum {min} characters'
            },
            buttons: {
              submit: 'Submit',
              cancel: 'Cancel',
              reset: 'Reset'
            }
          },
          messages: {
            success: 'Successful operation',
            error: 'Operation error',
            loading: 'Loading...',
            empty: 'No data'
          }
        }
      };

      // Verificar que el dataset es válido
      expect(typeof realWorldDataset).toBe('object');
      expect(Object.keys(realWorldDataset)).toEqual(['es', 'en']);
      
      // Verificar acceso a valores anidados
      const esAppName = (realWorldDataset.es.app as TranslationData).name;
      const enAppName = (realWorldDataset.en.app as TranslationData).name;
      
      expect(esAppName).toBe('Mi Aplicación');
      expect(enAppName).toBe('My Application');
    });

    it('should support dynamic key access', () => {
      const dataset: TranslationDataset = {
        es: {
          dynamic: {
            key1: 'Valor 1',
            key2: 'Valor 2'
          }
        }
      };

      const dynamicKeys = ['key1', 'key2'];
      
      dynamicKeys.forEach(key => {
        const value = (dataset.es.dynamic as TranslationData)[key];
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('Type Safety', () => {
    it('should enforce required properties', () => {
      // Estas líneas deberían causar errores de TypeScript si se descomenta:
      
      // const invalidGetOptions: GetTranslationOptions = {}; // Error: missing 'key'
      // const invalidTranslationData: TranslationData = { test: 123 }; // Error: value must be string or TranslationData
      
      // Pero estas deberían ser válidas:
      const validGetOptions: GetTranslationOptions = { key: 'test' };
      const validTranslationData: TranslationData = { test: 'value' };
      
      expect(validGetOptions.key).toBe('test');
      expect(validTranslationData.test).toBe('value');
    });

    it('should allow optional properties to be undefined', () => {
      const options: I18nOptions = {};
      const translateOptions: TranslateOptions = {};
      const getOptions: GetTranslationOptions = { key: 'test' };
      
      expect(options.lang).toBeUndefined();
      expect(translateOptions.lang).toBeUndefined();
      expect(translateOptions.element).toBeUndefined();
      expect(getOptions.lang).toBeUndefined();
    });
  });
});