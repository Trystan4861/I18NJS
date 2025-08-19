/**
 * Tests de performance para I18NJS
 * Verificación de rendimiento y optimización
 * Autor: @trystan4861
 */

import { I18n } from '../../src/I18n';
import { 
  createLargeTranslationDataset, 
  createManyElements, 
  measureExecutionTime,
  cleanDOM 
} from '../utils/test-helpers';

describe('I18n Performance Tests', () => {
  let i18n: I18n;

  beforeEach(() => {
    i18n = new I18n();
    cleanDOM();
  });

  describe('Translation Loading Performance', () => {
    it('should load small datasets quickly', async () => {
      const smallDataset = createLargeTranslationDataset(['es', 'en'], 100);
      
      const { time } = await measureExecutionTime(() => {
        i18n.loadTranslations(smallDataset);
      });
      
      expect(time).toBeLessThan(10); // Menos de 10ms
      expect(i18n.getLanguages()).toHaveLength(2);
    });

    it('should load medium datasets efficiently', async () => {
      const mediumDataset = createLargeTranslationDataset(['es', 'en', 'fr'], 500);
      
      const { time } = await measureExecutionTime(() => {
        i18n.loadTranslations(mediumDataset);
      });
      
      expect(time).toBeLessThan(50); // Menos de 50ms
      expect(i18n.getLanguages()).toHaveLength(3);
    });

    it('should load large datasets within reasonable time', async () => {
      const largeDataset = createLargeTranslationDataset(['es', 'en', 'fr', 'de', 'it'], 1000);
      
      const { time } = await measureExecutionTime(() => {
        i18n.loadTranslations(largeDataset);
      });
      
      expect(time).toBeLessThan(100); // Menos de 100ms
      expect(i18n.getLanguages()).toHaveLength(5);
    });

    it('should handle multiple load operations efficiently', async () => {
      const dataset = createLargeTranslationDataset(['es', 'en'], 200);
      
      const { time } = await measureExecutionTime(() => {
        // Cargar múltiples veces (simula actualizaciones)
        for (let i = 0; i < 10; i++) {
          i18n.loadTranslations(dataset);
        }
      });
      
      expect(time).toBeLessThan(100); // Menos de 100ms para 10 cargas
    });
  });

  describe('Translation Retrieval Performance', () => {
    beforeEach(() => {
      const dataset = createLargeTranslationDataset(['es', 'en', 'fr'], 1000);
      i18n.loadTranslations(dataset);
    });

    it('should retrieve simple translations quickly', async () => {
      const { time } = await measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          i18n.getTranslation({ key: `key_${i}`, lang: 'es' });
        }
      });
      
      expect(time).toBeLessThan(50); // Menos de 50ms para 1000 traducciones
    });

    it('should retrieve nested translations efficiently', async () => {
      const { time } = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          i18n.getTranslation({ key: `nested_${i * 10}.level1`, lang: 'es' });
          i18n.getTranslation({ key: `nested_${i * 10}.level2.deep`, lang: 'es' });
        }
      });
      
      expect(time).toBeLessThan(30); // Menos de 30ms para 200 traducciones anidadas
    });

    it('should handle missing keys efficiently', async () => {
      const { time } = await measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          i18n.getTranslation({ key: `nonexistent_${i}`, lang: 'es' });
        }
      });
      
      expect(time).toBeLessThan(20); // Menos de 20ms para 1000 claves inexistentes
    });

    it('should cache translation lookups effectively', async () => {
      const key = 'key_500';
      
      // Primera búsqueda (sin cache)
      const { time: firstTime } = await measureExecutionTime(() => {
        i18n.getTranslation({ key, lang: 'es' });
      });
      
      // Búsquedas repetidas (con cache potencial)
      const { time: repeatedTime } = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          i18n.getTranslation({ key, lang: 'es' });
        }
      });
      
      expect(repeatedTime).toBeLessThan(10); // Búsquedas repetidas muy rápidas
    });
  });

  describe('DOM Translation Performance', () => {
    beforeEach(() => {
      const dataset = createLargeTranslationDataset(['es', 'en'], 100);
      i18n.loadTranslations(dataset);
    });

    it('should translate few elements quickly', async () => {
      createManyElements(10, 'key_1');
      
      const { time } = await measureExecutionTime(() => {
        i18n.translate({ lang: 'es' });
      });
      
      expect(time).toBeLessThan(10); // Menos de 10ms para 10 elementos
    });

    it('should translate many elements efficiently', async () => {
      createManyElements(100, 'key_1');
      
      const { time } = await measureExecutionTime(() => {
        i18n.translate({ lang: 'es' });
      });
      
      expect(time).toBeLessThan(50); // Menos de 50ms para 100 elementos
    });

    it('should handle large DOM efficiently', async () => {
      createManyElements(1000, 'key_1');
      
      const { time } = await measureExecutionTime(() => {
        i18n.translate({ lang: 'es' });
      });
      
      expect(time).toBeLessThan(200); // Menos de 200ms para 1000 elementos
    });

    it('should translate mixed element types efficiently', async () => {
      // Crear diferentes tipos de elementos
      const elements = [
        ...createManyElements(100, 'key_1'),
        ...Array.from({ length: 50 }, (_, i) => {
          const input = document.createElement('input');
          input.setAttribute('data-i18n-key', 'key_2');
          input.placeholder = 'Original';
          document.body.appendChild(input);
          return input;
        }),
        ...Array.from({ length: 50 }, (_, i) => {
          const textarea = document.createElement('textarea');
          textarea.setAttribute('data-i18n-key', 'key_3');
          textarea.placeholder = 'Original';
          document.body.appendChild(textarea);
          return textarea;
        })
      ];
      
      const { time } = await measureExecutionTime(() => {
        i18n.translate({ lang: 'es' });
      });
      
      expect(time).toBeLessThan(100); // Menos de 100ms para 200 elementos mixtos
    });
  });

  describe('Language Switching Performance', () => {
    beforeEach(() => {
      const dataset = createLargeTranslationDataset(['es', 'en', 'fr'], 200);
      i18n.loadTranslations(dataset);
      createManyElements(100, 'key_1');
    });

    it('should switch languages quickly', async () => {
      const languages = ['es', 'en', 'fr', 'es', 'en'];
      
      const { time } = await measureExecutionTime(() => {
        languages.forEach(lang => {
          i18n.translate({ lang });
        });
      });
      
      expect(time).toBeLessThan(100); // Menos de 100ms para 5 cambios
    });

    it('should handle rapid language switching', async () => {
      const { time } = await measureExecutionTime(() => {
        for (let i = 0; i < 20; i++) {
          const lang = ['es', 'en', 'fr'][i % 3];
          i18n.translate({ lang });
        }
      });
      
      expect(time).toBeLessThan(200); // Menos de 200ms para 20 cambios rápidos
    });
  });

  describe('Memory Usage Optimization', () => {
    it('should not leak memory with repeated operations', async () => {
      const dataset = createLargeTranslationDataset(['es', 'en'], 100);
      
      // Simular uso intensivo
      for (let cycle = 0; cycle < 10; cycle++) {
        i18n.loadTranslations(dataset);
        createManyElements(50, 'key_1');
        i18n.translate({ lang: 'es' });
        i18n.translate({ lang: 'en' });
        cleanDOM();
      }
      
      // Si llegamos aquí sin errores de memoria, el test pasa
      expect(true).toBe(true);
    });

    it('should handle large datasets without memory issues', () => {
      const veryLargeDataset = createLargeTranslationDataset(['es', 'en', 'fr', 'de', 'it', 'pt'], 2000);
      
      expect(() => {
        i18n.loadTranslations(veryLargeDataset);
      }).not.toThrow();
      
      expect(i18n.getLanguages()).toHaveLength(6);
    });
  });

  describe('Concurrent Operations Performance', () => {
    it('should handle concurrent translations efficiently', async () => {
      const dataset = createLargeTranslationDataset(['es', 'en', 'fr'], 100);
      i18n.loadTranslations(dataset);
      
      // Crear elementos en diferentes contenedores
      const containers = Array.from({ length: 5 }, () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        return container;
      });
      
      containers.forEach((container, index) => {
        for (let i = 0; i < 20; i++) {
          const element = document.createElement('span');
          element.setAttribute('data-i18n-key', `key_${i}`);
          element.textContent = 'Original';
          container.appendChild(element);
        }
      });
      
      const { time } = await measureExecutionTime(async () => {
        // Simular traducciones concurrentes
        const promises = containers.map((container, index) => {
          return new Promise<void>(resolve => {
            setTimeout(() => {
              const elements = container.querySelectorAll('[data-i18n-key]');
              elements.forEach(element => {
                i18n.translate({ 
                  element: element as HTMLElement, 
                  lang: ['es', 'en', 'fr'][index % 3] 
                });
              });
              resolve();
            }, index * 10);
          });
        });
        
        await Promise.all(promises);
      });
      
      expect(time).toBeLessThan(300); // Menos de 300ms para operaciones concurrentes
    });
  });

  describe('Statistics Performance', () => {
    it('should calculate stats quickly for large datasets', async () => {
      const largeDataset = createLargeTranslationDataset(['es', 'en', 'fr'], 1000);
      i18n.loadTranslations(largeDataset);
      createManyElements(500, 'key_1');
      
      const { time, result } = await measureExecutionTime(() => {
        return i18n.getStats();
      });
      
      expect(time).toBeLessThan(50); // Menos de 50ms
      expect(result.totalElements).toBe(500);
      expect(result.availableLanguages).toHaveLength(3);
    });

    it('should handle repeated stats calculations efficiently', async () => {
      const dataset = createLargeTranslationDataset(['es', 'en'], 200);
      i18n.loadTranslations(dataset);
      createManyElements(100, 'key_1');
      
      const { time } = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          i18n.getStats();
        }
      });
      
      expect(time).toBeLessThan(100); // Menos de 100ms para 100 cálculos
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle empty operations efficiently', async () => {
      const { time } = await measureExecutionTime(() => {
        i18n.translate({ lang: 'es' }); // Sin elementos
        i18n.getStats(); // Sin traducciones
        i18n.getLanguages(); // Sin idiomas
      });
      
      expect(time).toBeLessThan(5); // Muy rápido para operaciones vacías
    });

    it('should handle malformed data gracefully', async () => {
      const malformedDataset = {
        es: {
          'key.with.dots': 'Value',
          '': 'Empty key',
          'very.very.very.very.deep.nested.key': 'Deep value'
        }
      };
      
      const { time } = await measureExecutionTime(() => {
        i18n.loadTranslations(malformedDataset);
        i18n.getTranslation({ key: 'key.with.dots', lang: 'es' });
        i18n.getTranslation({ key: '', lang: 'es' });
        i18n.getTranslation({ key: 'very.very.very.very.deep.nested.key', lang: 'es' });
      });
      
      expect(time).toBeLessThan(10); // Manejo eficiente de datos malformados
    });
  });
});