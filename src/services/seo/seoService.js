import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  AUTHOR_NAME,
  AUTHOR_URL,
} from '../../constants/seo';
import { getInstantGamingUrl, getG2aUrl, getSteamStoreUrl } from '../../config/affiliates';

/**
 * Normaliza y devuelve una URL canónica absoluta a partir de una ruta.
 * Sin barra diagonal final (salvo la raíz).
 */
export function canonicalUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath === '/') return SITE_URL;

  const withoutTrailing = normalizedPath.endsWith('/')
    ? normalizedPath.slice(0, -1)
    : normalizedPath;

  return `${SITE_URL}${withoutTrailing}`;
}

/**
 * Genera objeto JSON-LD para el esquema WebSite con SearchAction
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'es-ES',
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?game={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Genera objeto JSON-LD para el esquema WebApplication
 */
export function getWebApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#webapp`,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'GameApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: SITE_DESCRIPTION,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };
}

/**
 * Genera objeto JSON-LD para migas de pan (BreadcrumbList)
 */
export function getBreadcrumbJsonLd(items = []) {
  const listElements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: canonicalUrl('/'),
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listElements,
  };
}

/**
 * Genera objeto JSON-LD para FAQPage
 */
export function getFaqJsonLd(faqs = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Genera objeto JSON-LD específico para un análisis de juego realizado
 */
export function getGameAnalysisJsonLd(gameInfo, result) {
  if (!gameInfo || !result) return null;

  const gameName = gameInfo.name || `Juego (AppID: ${result.app_id})`;
  const gameUrl = getSteamStoreUrl(result.app_id);
  const igUrl = getInstantGamingUrl(gameName, result.app_id);
  const g2aUrl = getG2aUrl(gameName);

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: gameName,
    applicationCategory: 'Game',
    operatingSystem: 'Windows, macOS, Linux',
    url: gameUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: result.sentiment_stats?.positive_pct || 0,
      bestRating: 100,
      worstRating: 0,
      ratingCount: result.total_reviews_analyzed || 1,
      reviewCount: result.total_reviews_analyzed || 1,
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Instant Gaming Key',
        url: igUrl,
        seller: {
          '@type': 'Organization',
          name: 'Instant Gaming',
        },
      },
      {
        '@type': 'Offer',
        name: 'G2A Marketplace',
        url: g2aUrl,
        seller: {
          '@type': 'Organization',
          name: 'G2A',
        },
      },
    ],
    review: {
      '@type': 'Review',
      author: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: result.sentiment_stats?.positive_pct || 0,
        bestRating: 100,
        worstRating: 0,
      },
      name: `Veredicto de Reseñas: ${result.recommendation_level}`,
      reviewBody: `Análisis NLP de ${result.total_reviews_analyzed} reseñas en español. Veredicto: ${result.recommendation_level} (${result.sentiment_stats?.positive_pct}% positivas).`,
    },
  };
}
