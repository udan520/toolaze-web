/**
 * Helper function to generate hreflang alternate URLs
 * This is used in page metadata to tell search engines about alternate language versions
 */
export function generateHreflangAlternates(
  currentLocale: string,
  pathWithoutLocale: string = ''
): { languages: Record<string, string>; canonical: string } {
  const baseUrl = 'https://toolaze.com'
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  
  const languages: Record<string, string> = {}
  
  locales.forEach(locale => {
    // English doesn't have /en prefix
    if (locale === 'en') {
      languages[locale] = `${baseUrl}${pathWithoutLocale}`
    } else {
      languages[locale] = `${baseUrl}/${locale}${pathWithoutLocale}`
    }
  })
  
  // Canonical URL: English doesn't have /en prefix
  const canonical = currentLocale === 'en' 
    ? `${baseUrl}${pathWithoutLocale}`
    : `${baseUrl}/${currentLocale}${pathWithoutLocale}`
  
  return {
    languages,
    canonical,
  }
}
