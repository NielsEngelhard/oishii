import { Locale, defaultLocale, isValidLocale } from '@/i18n/config';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export function setLanguageCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`;
}

export function getLanguageCookie(): Locale {
  if (typeof document === 'undefined') {
    return defaultLocale;
  }

  const match = document.cookie.match(new RegExp(`(^| )${LOCALE_COOKIE_NAME}=([^;]+)`));
  const value = match?.[2];

  if (value && isValidLocale(value)) {
    return value;
  }

  return defaultLocale;
}
