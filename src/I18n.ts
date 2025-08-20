/**
 * Clase para manejar traducciones i18n en aplicaciones web
 * Permite traducir elementos del DOM usando data-attributes
 * Autor: @trystan4861
 */

import type {
  I18nOptions,
  TranslateOptions,
  GetTranslationOptions,
  TranslationData,
  TranslationDataset,
  I18nStats,
  CacheEntry,
  CacheStorage
} from './types/i18n.types';

export class I18n {
  public defaultLang: string = 'es';
  public translations: TranslationDataset = {};
  private cacheStorage: CacheStorage = {};
  private readonly CACHE_KEY = 'i18n_cache_storage';
  private readonly DEFAULT_CACHE_LIFETIME_HOURS = 24;

  /**
   * Constructor de la clase I18n
   * @param defaultLang - Idioma por defecto (opcional)
   */
  constructor(defaultLang: string = 'es') {
    this.defaultLang = defaultLang;
    this.loadCacheFromStorage();
  }

  /**
   * Inicializa la clase I18n con opciones opcionales
   * @param options - Objeto con configuraciones opcionales
   */
  async init(options: I18nOptions = {}): Promise<void> {
    if (options.lang) {
      this.defaultLang = options.lang;
      document.documentElement.lang = options.lang;
    }

    if (options.remoteUrl) {
      await this.loadFromRemoteUrl(
        options.remoteUrl, 
        options.cacheLifetimeHours || this.DEFAULT_CACHE_LIFETIME_HOURS
      );
    }
  }

  /**
   * Carga las traducciones desde un objeto de datos
   * @param translationData - Objeto con las traducciones organizadas por idioma
   */
  loadTranslations(translationData: TranslationDataset): void {
    this.translations = translationData;
  }

  /**
   * Traduce elementos del DOM que contengan data-i18n-key
   * @param options - Objeto con opciones de traducción
   */
  translate(options: TranslateOptions = {}): void {
    const targetLang = options.lang || this.defaultLang;
    
    if (options.element) {
      this.translateElement(options.element, targetLang);
    } else {
      const elements = document.querySelectorAll('[data-i18n-key]');
      elements.forEach(element => {
        this.translateElement(element as HTMLElement, targetLang);
      });
    }
  }

  /**
   * Obtiene una traducción específica por clave
   * @param options - Objeto con la clave y idioma opcional
   * @returns La traducción encontrada o la clave original si no existe
   */
  getTranslation(options: GetTranslationOptions): string {
    const { key, lang = this.getCurrentLang() } = options;
    
    const translation = this.getNestedTranslation(
      this.translations[lang] || {}, 
      key
    );
    
    return translation || key;
  }

  /**
   * Traduce un elemento específico del DOM
   * @param element - Elemento HTML a traducir
   * @param lang - Idioma de destino
   */
  private translateElement(element: HTMLElement, lang: string): void {
    const key = element.getAttribute('data-i18n-key');
    if (!key) return;

    // Establecer o actualizar el idioma del elemento
    element.setAttribute('data-i18n-lang', lang);

    const translation = this.getTranslation({ key, lang });
    
    // Actualizar el contenido del elemento
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const inputElement = element as HTMLInputElement;
      if (inputElement.placeholder !== undefined) {
        inputElement.placeholder = translation;
      } else {
        inputElement.value = translation;
      }
    } else {
      element.textContent = translation;
    }
  }

  /**
   * Obtiene una traducción anidada usando notación de puntos
   * @param obj - Objeto de traducciones
   * @param key - Clave con notación de puntos (ej: "labels.completed")
   * @returns La traducción encontrada o null si no existe
   */
  private getNestedTranslation(
    obj: TranslationData, 
    key: string
  ): string | null {
    // Manejar casos de null/undefined
    if (!key || typeof key !== 'string') {
      return null;
    }

    const keys = key.split('.');
    let current: any = obj;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }



  /**
   * Obtiene el idioma actual de la aplicación
   * @returns El idioma actual o el idioma por defecto
   */
  getCurrentLang(): string {
    return document.documentElement.lang || this.defaultLang;
  }

  /**
   * Establece el idioma por defecto de la clase
   * @param lang - Nuevo idioma por defecto
   */
  setDefaultLang(lang: string): void {
    this.defaultLang = lang;
  }

  /**
   * Actualiza los atributos data-i18n-lang faltantes
   */
  updateMissingLangAttributes(): void {
    const currentLang = this.getCurrentLang();
    const elements = document.querySelectorAll('[data-i18n-key]');
    
    elements.forEach(element => {
      if (!element.getAttribute('data-i18n-lang')) {
        element.setAttribute('data-i18n-lang', currentLang);
      }
    });
  }

  /**
   * Obtiene la lista de idiomas disponibles
   * @returns Array con los códigos de idioma disponibles
   */
  getLanguages(): string[] {
    return Object.keys(this.translations);
  }

  /**
   * Obtiene estadísticas de traducción
   * @returns Objeto con estadísticas
   */
  getStats(): I18nStats {
    const elements = document.querySelectorAll('[data-i18n-key]');
    const languages = this.getLanguages();
    const totalKeys = this.countTranslationKeys();
    
    return {
      totalElements: elements.length,
      availableLanguages: languages,
      totalTranslationKeys: totalKeys,
      currentLang: this.getCurrentLang(),
      defaultLang: this.defaultLang
    };
  }

  /**
   * Cuenta el total de claves de traducción
   * @returns Número total de claves
   */
  private countTranslationKeys(): number {
    let count = 0;
    
    const countKeys = (obj: TranslationData): void => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          count++;
        } else if (typeof obj[key] === 'object') {
          countKeys(obj[key] as TranslationData);
        }
      }
    };
    
    // Contar claves del primer idioma disponible
    const firstLang = this.getLanguages()[0];
    if (firstLang && this.translations[firstLang]) {
      countKeys(this.translations[firstLang]);
    }
    
    return count;
  }

  /**
   * Carga traducciones desde una URL remota con caché
   * @param url - URL del archivo de traducciones
   * @param cacheLifetimeHours - Tiempo de vida del caché en horas
   */
  async loadFromRemoteUrl(url: string, cacheLifetimeHours: number = this.DEFAULT_CACHE_LIFETIME_HOURS): Promise<void> {
    try {
      // Verificar si existe caché válido
      const cachedData = this.getCachedData(url);
      if (cachedData) {
        this.translations = { ...this.translations, ...cachedData };
        return;
      }

      // Descargar datos remotos
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al descargar traducciones: ${response.status} ${response.statusText}`);
      }

      const translationData: TranslationDataset = await response.json();
      
      // Guardar en caché
      this.saveToCacheStorage(url, translationData, cacheLifetimeHours);
      
      // Cargar traducciones
      this.translations = { ...this.translations, ...translationData };
      
    } catch (error) {
      console.error('Error cargando traducciones remotas:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos del caché si están disponibles y son válidos
   * @param url - URL del recurso
   * @returns Datos de traducción o null si no hay caché válido
   */
  private getCachedData(url: string): TranslationDataset | null {
    const cacheEntry = this.cacheStorage[url];
    
    if (!cacheEntry) {
      return null;
    }

    const now = Date.now();
    const cacheAge = now - cacheEntry.timestamp;
    const maxAge = cacheEntry.lifetimeHours * 60 * 60 * 1000; // Convertir horas a milisegundos

    if (cacheAge > maxAge) {
      // Caché expirado, eliminarlo
      delete this.cacheStorage[url];
      this.saveCacheToStorage();
      return null;
    }

    return cacheEntry.data;
  }

  /**
   * Guarda datos en el caché
   * @param url - URL del recurso
   * @param data - Datos de traducción
   * @param lifetimeHours - Tiempo de vida en horas
   */
  private saveToCacheStorage(url: string, data: TranslationDataset, lifetimeHours: number): void {
    const cacheEntry: CacheEntry = {
      data,
      timestamp: Date.now(),
      url,
      lifetimeHours
    };

    this.cacheStorage[url] = cacheEntry;
    this.saveCacheToStorage();
  }

  /**
   * Carga el caché desde localStorage
   */
  private loadCacheFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }

      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        this.cacheStorage = JSON.parse(cached);
        // Limpiar entradas expiradas al cargar
        this.cleanExpiredCache();
      }
    } catch (error) {
      console.error('Error cargando caché desde localStorage:', error);
      this.cacheStorage = {};
    }
  }

  /**
   * Guarda el caché en localStorage
   */
  private saveCacheToStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cacheStorage));
    } catch (error) {
      console.error('Error guardando caché en localStorage:', error);
    }
  }

  /**
   * Limpia entradas de caché expiradas
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    let hasExpiredEntries = false;

    for (const url in this.cacheStorage) {
      const entry = this.cacheStorage[url];
      if (!entry) continue;
      
      const cacheAge = now - entry.timestamp;
      const maxAge = entry.lifetimeHours * 60 * 60 * 1000;

      if (cacheAge > maxAge) {
        delete this.cacheStorage[url];
        hasExpiredEntries = true;
      }
    }

    if (hasExpiredEntries) {
      this.saveCacheToStorage();
    }
  }

  /**
   * Limpia todo el caché
   */
  clearCache(): void {
    this.cacheStorage = {};
    this.saveCacheToStorage();
  }

  /**
   * Obtiene información del caché
   * @returns Objeto con información del caché
   */
  getCacheInfo(): { [url: string]: { timestamp: number; lifetimeHours: number; isExpired: boolean } } {
    const now = Date.now();
    const info: { [url: string]: { timestamp: number; lifetimeHours: number; isExpired: boolean } } = {};

    for (const url in this.cacheStorage) {
      const entry = this.cacheStorage[url];
      if (!entry) continue;
      
      const cacheAge = now - entry.timestamp;
      const maxAge = entry.lifetimeHours * 60 * 60 * 1000;

      info[url] = {
        timestamp: entry.timestamp,
        lifetimeHours: entry.lifetimeHours,
        isExpired: cacheAge > maxAge
      };
    }

    return info;
  }
}