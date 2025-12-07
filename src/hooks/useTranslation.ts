import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Custom hook for translations
 * Provides a simplified interface to react-i18next
 */
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  return {
    t: (key: string, options?: any) => t(key, options),
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
  };
};
