/**
 * Clase I18n compilada a JavaScript para la demo
 * Versión simplificada sin TypeScript para uso directo en navegador
 * Autor: @trystan4861
 */

class I18n {
  constructor() {
    this.defaultLang = 'es';
    this.translations = {};
  }

  /**
   * Inicializa la clase I18n con opciones opcionales
   * @param {Object} options - Objeto con configuraciones opcionales
   * @param {string} options.lang - Idioma por defecto
   */
  init(options = {}) {
    if (options.lang) {
      this.defaultLang = options.lang;
    }
  }

  /**
   * Carga las traducciones desde un objeto de datos
   * @param {Object} translationData - Objeto con las traducciones organizadas por idioma
   */
  loadTranslations(translationData) {
    this.translations = translationData;
  }

  /**
   * Traduce elementos del DOM que contengan data-i18n-key
   * @param {Object} options - Objeto con opciones de traducción
   * @param {HTMLElement} options.element - Elemento específico a traducir
   * @param {string} options.lang - Idioma de destino
   */
  translate(options = {}) {
    const targetLang = options.lang || this.defaultLang;
    
    if (options.element) {
      this.translateElement(options.element, targetLang);
    } else {
      const elements = document.querySelectorAll('[data-i18n-key]');
      elements.forEach(element => {
        this.translateElement(element, targetLang);
      });
    }
  }

  /**
   * Obtiene una traducción específica por clave
   * @param {Object} options - Objeto con la clave y idioma opcional
   * @param {string} options.key - Clave de traducción
   * @param {string} options.lang - Idioma (opcional)
   * @returns {string} La traducción encontrada o la clave original si no existe
   */
  getTranslation(options) {
    const { key, lang = this.defaultLang } = options;
    
    const translation = this.getNestedTranslation(
      this.translations[lang] || {}, 
      key
    );
    
    return translation || key;
  }

  /**
   * Traduce un elemento específico del DOM
   * @param {HTMLElement} element - Elemento HTML a traducir
   * @param {string} lang - Idioma de destino
   */
  translateElement(element, lang) {
    const key = element.getAttribute('data-i18n-key');
    if (!key) return;

    // Establecer o actualizar el idioma del elemento
    element.setAttribute('data-i18n-lang', lang);

    const translation = this.getTranslation({ key, lang });
    
    // Actualizar el contenido del elemento
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.placeholder !== undefined) {
        element.placeholder = translation;
      } else {
        element.value = translation;
      }
    } else if (element.tagName === 'TITLE') {
      element.textContent = translation;
      document.title = translation;
    } else {
      element.textContent = translation;
    }
  }

  /**
   * Obtiene una traducción anidada usando notación de puntos
   * @param {Object} obj - Objeto de traducciones
   * @param {string} key - Clave con notación de puntos (ej: "labels.completed")
   * @returns {string|null} La traducción encontrada o null si no existe
   */
  getNestedTranslation(obj, key) {
    const keys = key.split('.');
    let current = obj;

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
   * Actualiza los atributos data-i18n-lang de elementos sin este atributo
   */
  updateMissingLangAttributes() {
    const currentLang = document.documentElement.lang || this.defaultLang;
    const elements = document.querySelectorAll('[data-i18n-key]:not([data-i18n-lang])');
    
    elements.forEach(element => {
      element.setAttribute('data-i18n-lang', currentLang);
    });
  }

  /**
   * Obtiene el idioma actual de la aplicación
   * @returns {string} El idioma actual o el idioma por defecto
   */
  getCurrentLang() {
    return document.documentElement.lang || this.defaultLang;
  }

  /**
   * Establece el idioma por defecto de la clase
   * @param {string} lang - Nuevo idioma por defecto
   */
  setDefaultLang(lang) {
    this.defaultLang = lang;
  }

  /**
   * Obtiene la lista de idiomas disponibles
   * @returns {string[]} Array con los códigos de idioma disponibles
   */
  getLanguages() {
    return Object.keys(this.translations);
  }

  /**
   * Obtiene estadísticas de traducción
   * @returns {Object} Objeto con estadísticas
   */
  getStats() {
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
   * @returns {number} Número total de claves
   */
  countTranslationKeys() {
    let count = 0;
    
    const countKeys = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          count++;
        } else if (typeof obj[key] === 'object') {
          countKeys(obj[key]);
        }
      }
    };
    
    // Contar claves del primer idioma disponible
    const firstLang = this.getLanguages()[0];
    if (firstLang) {
      countKeys(this.translations[firstLang]);
    }
    
    return count;
  }
}

// Hacer la clase disponible globalmente
window.I18n = I18n;