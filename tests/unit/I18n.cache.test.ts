/**
 * Tests para la funcionalidad de caché remoto de I18n
 * Autor: @trystan4861
 */

import { I18n } from '../../src/I18n';

// Mock de fetch para las pruebas
global.fetch = jest.fn();

// Mock de localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('I18n Cache Functionality', () => {
  let i18n: I18n;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    i18n = new I18n();
    mockFetch.mockClear();
    localStorageMock.clear();
  });

  describe('loadFromRemoteUrl', () => {
    const mockTranslations = {
      es: {
        hello: 'Hola',
        goodbye: 'Adiós'
      },
      en: {
        hello: 'Hello',
        goodbye: 'Goodbye'
      }
    };

    it('should load translations from remote URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      await i18n.loadFromRemoteUrl('https://example.com/translations.json');

      expect(mockFetch).toHaveBeenCalledWith('https://example.com/translations.json');
      expect(i18n.translations).toEqual(mockTranslations);
    });

    it('should cache translations in localStorage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      await i18n.loadFromRemoteUrl('https://example.com/translations.json', 12);

      // Verificar que se guardó en localStorage
      const cacheKey = 'i18n_cache_storage';
      const cachedDataString = localStorageMock.getItem(cacheKey);
      expect(cachedDataString).not.toBeNull();
      
      if (cachedDataString) {
        const cachedData = JSON.parse(cachedDataString);
        expect(cachedData['https://example.com/translations.json']).toBeDefined();
        expect(cachedData['https://example.com/translations.json'].data).toEqual(mockTranslations);
        expect(cachedData['https://example.com/translations.json'].lifetimeHours).toBe(12);
      }
    });

    it('should use cached data when available and valid', async () => {
      // Primero cargar datos
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      await i18n.loadFromRemoteUrl('https://example.com/translations.json');

      // Crear nueva instancia que debería usar caché
      const i18n2 = new I18n();
      await i18n2.loadFromRemoteUrl('https://example.com/translations.json');

      // fetch solo debería haberse llamado una vez
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(i18n2.translations).toEqual(mockTranslations);
    });

    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(i18n.loadFromRemoteUrl('https://example.com/translations.json'))
        .rejects.toThrow('Network error');
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response);

      await expect(i18n.loadFromRemoteUrl('https://example.com/translations.json'))
        .rejects.toThrow('Error al descargar traducciones: 404 Not Found');
    });
  });

  describe('init with remote URL', () => {
    it('should load translations during init', async () => {
      const mockTranslations = {
        es: { hello: 'Hola' },
        en: { hello: 'Hello' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      await i18n.init({
        lang: 'es',
        remoteUrl: 'https://example.com/translations.json',
        cacheLifetimeHours: 6
      });

      expect(i18n.translations.es.hello).toBe('Hola');
      expect(i18n.translations.en.hello).toBe('Hello');
      expect(i18n.defaultLang).toBe('es');
    });
  });

  describe('cache management', () => {
    it('should clear cache', async () => {
      const mockTranslations = { es: { hello: 'Hola' } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      await i18n.loadFromRemoteUrl('https://example.com/translations.json');
      
      // Verificar que hay caché
      const cachedBefore = localStorageMock.getItem('i18n_cache_storage');
      expect(cachedBefore).not.toBeNull();
      expect(cachedBefore).not.toBe('{}');

      i18n.clearCache();

      // Verificar que el caché se limpió
      const cachedAfter = localStorageMock.getItem('i18n_cache_storage');
      expect(cachedAfter).toBe('{}');
    });

    it('should provide cache info', async () => {
      const mockTranslations = { es: { hello: 'Hola' } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      await i18n.loadFromRemoteUrl('https://example.com/translations.json', 12);

      const cacheInfo = i18n.getCacheInfo();
      const urlKey = 'https://example.com/translations.json';
      
      expect(cacheInfo[urlKey]).toBeDefined();
      expect(cacheInfo[urlKey].lifetimeHours).toBe(12);
      expect(cacheInfo[urlKey].isExpired).toBe(false);
      expect(typeof cacheInfo[urlKey].timestamp).toBe('number');
    });

    it('should handle multiple URLs', async () => {
      const mockTranslations1 = { es: { hello: 'Hola' } };
      const mockTranslations2 = { es: { world: 'Mundo' } };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTranslations1
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTranslations2
        } as Response);

      await i18n.loadFromRemoteUrl('https://example.com/translations1.json');
      await i18n.loadFromRemoteUrl('https://example.com/translations2.json');

      // Las traducciones se fusionan correctamente
      expect(i18n.translations.es.hello).toBe('Hola');
      expect(i18n.translations.es.world).toBe('Mundo');

      const cacheInfo = i18n.getCacheInfo();
      expect(Object.keys(cacheInfo)).toHaveLength(2);
    });
  });

  describe('cache expiration', () => {
    it('should not use expired cache', async () => {
      const mockTranslations = { es: { hello: 'Hola' } };

      // Mock Date.now para simular tiempo transcurrido
      const originalDateNow = Date.now;
      const mockTime = 1000000000000; // Tiempo base
      Date.now = jest.fn(() => mockTime);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      // Cargar con caché de 1 hora
      await i18n.loadFromRemoteUrl('https://example.com/translations.json', 1);

      // Simular que han pasado 2 horas
      Date.now = jest.fn(() => mockTime + (2 * 60 * 60 * 1000));

      // Crear nueva instancia
      const i18n2 = new I18n();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations
      } as Response);

      await i18n2.loadFromRemoteUrl('https://example.com/translations.json', 1);

      // fetch debería haberse llamado dos veces (caché expirado)
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Restaurar Date.now
      Date.now = originalDateNow;
    });
  });
});