import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SortDropdown } from '@/components/product/SortDropdown';
import { OptimizedImage } from '@/components/ui/Image';
import { CollectionBrowser } from './CollectionBrowser';
import { fetchCollection, fetchCollections, fetchShop } from '@/lib/shopify';
import type { Product } from '@/types/shopify';

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ page?: string; sort?: string; min?: string; max?: string; tag?: string }>;
}

function sortProducts(products: Product[], sortKey?: string): Product[] {
  const list = [...products];
  let sorted: Product[];
  switch (sortKey) {
    case 'TITLE_ASC':
      sorted = list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'TITLE_DESC':
      sorted = list.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'PRICE_ASC':
      sorted = list.sort(
        (a, b) => a.priceRange.minVariantPrice.amount - b.priceRange.minVariantPrice.amount
      );
      break;
    case 'PRICE_DESC':
      sorted = list.sort(
        (a, b) => b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount
      );
      break;
    case 'CREATED_DESC':
      sorted = list.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
      break;
    case 'BEST_SELLING':
    default:
      sorted = list;
      break;
  }

  // Push sold out items to the end
  return sorted.sort((a, b) => {
    const aInStock = a.availableForSale && (a.totalInventory ?? 0) > 0;
    const bInStock = b.availableForSale && (b.totalInventory ?? 0) > 0;
    if (aInStock === bInStock) return 0;
    return aInStock ? -1 : 1;
  });
}

async function getCollectionData(handle: string, searchParams: { page?: string; sort?: string; min?: string; max?: string; tag?: string }) {
  const page = parseInt(searchParams.page || '1');
  const first = 10;
  const sortKey = searchParams.sort;
  
  const [collection, allCollections, shop] = await Promise.all([
    fetchCollection(handle, first, undefined, sortKey),
    fetchCollections(20),
    fetchShop(),
  ]);

  if (!collection) return null;

  return {
    collection,
    allCollections: allCollections.edges.map(({ node }) => node),
    shop,
    currentPage: page,
  };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : (params as { handle: string });
  const collection = await fetchCollection(resolvedParams?.handle, 1);
  if (!collection) {
    return { title: 'Collection Not Found' };
  }
  return {
    title: collection.title,
    description: collection.description || `Shop the ${collection.title} collection at AURA.`,
    openGraph: {
      title: collection.title,
      description: collection.description || `Shop the ${collection.title} collection at AURA.`,
      images: collection.image ? [{ url: collection.image.url, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const data = await getCollectionData(resolvedParams.handle, resolvedSearchParams);
  
  if (!data) {
    notFound();
  }

  const { collection, allCollections, shop, currentPage } = data;
  const rawProducts = collection.products.edges.map(({ node }) => node);
  const sortedProducts = sortProducts(rawProducts, resolvedSearchParams.sort);

  const hasNextPage = collection.products.pageInfo.hasNextPage;
  const hasPrevPage = currentPage > 1;

  // Determine if this is a saree collection for lookbook strips
  const isSareeCollection = resolvedParams.handle.includes('saree') || resolvedParams.handle.includes('silk');

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <header className="section-sm bg-surface border-b border-ink/10" aria-labelledby="page-title">
        <div className="container">
          <nav className="flex items-center gap-2 text-caption text-faint mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/collections" className="hover:text-ink transition-colors">Collections</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink font-medium">{collection.title}</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="overline mb-2 inline-block">Collection</span>
              <h1 id="page-title" className="font-heading text-display-lg tracking-tight text-ink mb-3">{collection.title}</h1>
              {collection.description && (
                <p className="text-body-lg text-faint">{collection.description}</p>
              )}
            </div>
            <div className="flex items-center gap-4" role="group" aria-label="Collection actions">
              <SortDropdown currentSort={resolvedSearchParams.sort} />
            </div>
          </div>
        </div>
      </header>

      {/* Products + filters + interleaved lookbooks */}
      <CollectionBrowser
        products={sortedProducts}
        collectionHandle={resolvedParams.handle}
        interleaveLookbooks={isSareeCollection}
      />

      {/* Pagination */}
      {(hasPrevPage || hasNextPage) && (
        <nav className="container mb-16 flex items-center justify-center gap-2" aria-label="Pagination">
          {hasPrevPage && (
            <Link
              href={`/collections/${collection.handle}?page=${currentPage - 1}`}
              className="btn-secondary px-4"
              aria-label="Previous page"
            >
              Previous
            </Link>
          )}
          <span className="px-4 text-body text-faint" aria-current="page">
            Page {currentPage}
          </span>
          {hasNextPage && (
            <Link
              href={`/collections/${collection.handle}?page=${currentPage + 1}`}
              className="btn-secondary px-4"
              aria-label="Next page"
            >
              Next
            </Link>
          )}
        </nav>
      )}

      {/* Other Collections */}
      <section className="section bg-surface border-y border-ink/10" aria-labelledby="other-collections-heading">
        <div className="container">
          <header className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
            <h2 id="other-collections-heading" className="font-heading text-display-sm sm:text-display-md tracking-tight text-ink">
              Continue Exploring
            </h2>
          </header>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {allCollections
              .filter((c) => c.handle !== collection.handle)
              .slice(0, 4)
              .map((otherCollection) => (
                <Link
                  key={otherCollection.id}
                  href={`/collections/${otherCollection.handle}`}
                  className="group overflow-hidden"
                >
                  <div className="relative aspect-4-5 overflow-hidden">
                    {otherCollection.image ? (
                      <OptimizedImage
                        src={otherCollection.image.url}
                        alt={otherCollection.image.altText || otherCollection.title}
                        fill
                        className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="aspect-4-5 bg-sunken" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                      <h3 className="font-heading text-accent-ink text-body sm:text-heading-md font-medium">{otherCollection.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}