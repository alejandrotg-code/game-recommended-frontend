import { Helmet } from 'react-helmet-async';
import {
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_TITLE_TEMPLATE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_HANDLE,
  SITE_LOCALE,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  AUTHOR_NAME,
} from '../constants/seo';
import { canonicalUrl } from '../services/seo/seoService';

export default function SeoHead({
  title,
  description = SITE_DESCRIPTION,
  canonicalPath = '/',
  ogImage = OG_IMAGE_PATH,
  keywords = SITE_KEYWORDS,
  jsonLd = null,
}) {
  const fullCanonicalUrl = canonicalUrl(canonicalPath);
  const fullOgImage = ogImage.startsWith('http')
    ? ogImage
    : canonicalUrl(ogImage);

  const formattedTitle = title
    ? SITE_TITLE_TEMPLATE.replace('%s', title)
    : SITE_TITLE_DEFAULT;

  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  // Si jsonLd es un array o único objeto
  const jsonLdArray = Array.isArray(jsonLd)
    ? jsonLd.filter(Boolean)
    : jsonLd
    ? [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Título Principal */}
      <title>{formattedTitle}</title>

      {/* Meta Etiquetas Básicas */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={AUTHOR_NAME} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* URL Canónica */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={formattedTitle} />

      {/* Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_HANDLE} />
      <meta name="twitter:creator" content={SITE_HANDLE} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Inyección de Datos Estructurados JSON-LD */}
      {jsonLdArray.map((ld, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}
