'use client';

import { useI18n } from '../contexts/I18nContext';
import enTranslations from '../../locales/en.json';
import frTranslations from '../../locales/fr.json';

const translations = {
  en: enTranslations,
  fr: frTranslations,
};

export function useTranslations() {
  const { locale } = useI18n();

  console.log('useTranslations called with locale:', locale);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      console.warn(`Translation key "${key}" not found for locale "${locale}"`);
      return key;
    }
    
    // Replace parameters in the translation
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  };

  return t;
}
