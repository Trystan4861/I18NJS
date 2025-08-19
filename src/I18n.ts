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
  TranslationDataset
} from './types/i18n.types';

export class I18n {
  private defaultLang: string = 'es';
  private translations: TranslationDataset = {};

  /**
   * Inicializa la clase I18n con opciones opcionales
   * @param options - Objeto con configuraciones opcionales
   */
  init(options: I18nOptions = {}): void {
    if (options.lang) {
      this.defaultLang = options.lang;
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
    const { key, lang = this.defaultLang } = options;
    
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
   * Actualiza los atributos data-i18n-lang de elementos sin este atributo
   */
  updateMissingLangAttributes(): void {
    const currentLang = document.documentElement.lang || this.defaultLang;
    const elements = document.querySelectorAll('[data-i18n-key]:not([data-i18n-lang])');
    
    elements.forEach(element => {
      element.setAttribute('data-i18n-lang', currentLang);
    });
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
}