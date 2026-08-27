import type { Product } from '@/types/shopify';

export function ProductJsonLd({ product }: { product: Product }) {
  const minPrice = product.priceRange.minVariantPrice;
  const image = product.featuredImage?.url || product.images?.edges[0]?.node?.url;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: image ? [image] : [],
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'AURA',
    },
    offers: {
      '@type': 'Offer',
      price: minPrice.amount,
      priceCurrency: minPrice.currencyCode,
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AURA Atelier',
    url: 'https://aura.com',
    logo: 'https://aura.com/logo.png',
    sameAs: [
      'https://instagram.com/aura_atelier',
      'https://facebook.com/aura_atelier',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
