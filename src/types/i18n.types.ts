/**
 * Interfaces y tipos para el sistema de internacionalización I18n
 * Autor: @trystan4861
 */

export interface I18nOptions {
  lang?: string;
  remoteUrl?: string;
  cacheLifetimeHours?: number;
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

export interface I18nStats {
  totalElements: number;
  availableLanguages: string[];
  totalTranslationKeys: number;
  currentLang: string;
  defaultLang: string;
}

export interface CacheEntry {
  data: TranslationDataset;
  timestamp: number;
  url: string;
  lifetimeHours: number;
}

export interface CacheStorage {
  [url: string]: CacheEntry;
}