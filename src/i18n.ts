import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Backend resource loader
const backendLoader = {
  type: 'backend' as const,
  init: () => {},
  read: async (language: string, _namespace: string, callback: (err: any, data: any) => void) => {
    try {
      const response = await fetch(`${API_BASE_URL}/translations/${language}`);
      const data = await response.json();
      
      // Flatten the translations structure
      const flattenedTranslations = data.translations.words || {};
      
      callback(null, flattenedTranslations);
    } catch (error) {
      console.error('Failed to load translations:', error);
      callback(error, {});
    }
  },
};

i18n
  .use(backendLoader as any)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // Remove hardcoded lng to let LanguageDetector read from localStorage
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lang',
    },
  });

export default i18n;
