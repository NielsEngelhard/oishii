import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, isValidLocale, type Locale } from './config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;

  const locale: Locale = localeCookie && isValidLocale(localeCookie)
    ? localeCookie
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    onError(error) {
      // Silently fall back to default locale on missing translations
      console.warn('Translation error:', error.message);
    },
    getMessageFallback({ namespace, key }) {
      // Return the key itself as fallback (English messages should always exist)
      return `${namespace}.${key}`;
    }
  };
});
