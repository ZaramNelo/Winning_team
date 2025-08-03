'use client';

import { createContext, useContext, useState } from 'react';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');

  console.log('I18nProvider rendered with locale:', locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
