/**
 * Interfaces y tipos para el sistema de internacionalización I18n
 * Autor: @trystan4861
 */

export interface I18nOptions {
  lang?: string;
}

export interface TranslateOptions {
  element?: HTMLElement;
  lang?: string;
}

export interface GetTranslationOptions {
  key: string;
  lang?: string;
}

export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface TranslationDataset {
  [lang: string]: TranslationData;
}