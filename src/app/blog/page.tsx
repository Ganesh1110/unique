import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full space-y-12">
        <header className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1e3932]">AURA Atelier Journal</span>
          <h1 className="font-heading text-display-md font-extrabold tracking-tight text-neutral-950">Stories &amp; Master Weaves</h1>
          <p className="text-body text-neutral-600">
            Explore editorial guides on handloom heritage, Kanjeevaram silk care, saree draping techniques, and weaver artisan spotlights.
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="bg-neutral-50 p-12 rounded-2xl text-center border border-neutral-200 space-y-3">
            <h3 className="font-heading text-heading-sm font-bold text-neutral-800">New Editorial Stories Coming Soon</h3>
            <p className="text-body-xs text-neutral-500 max-w-md mx-auto">
              Our curators and textile historians are crafting deep dives into Indian handloom heritage. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => {
              const imgUrl = art.image
                ? typeof art.image === 'string' && art.image.startsWith('{')
                  ? (JSON.parse(art.image) as any)?.url
                  : art.image
                : '/placeholder.svg';

              return (
                <article key={art.id} className="group flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400">
                        <span>{art.author || 'AURA Atelier'}</span>
                        <span>•</span>
                        <span>{new Date(art.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h2 className="font-heading text-heading-xs font-bold text-neutral-950 group-hover:text-[#1e3932] transition">
                        <Link href={`/blog/${art.handle}`}>{art.title}</Link>
                      </h2>
                      <p className="text-body-xs text-neutral-600 line-clamp-3 leading-relaxed">{art.excerpt}</p>
                    </div>

                    <Link
                      href={`/blog/${art.handle}`}
                      className="inline-flex items-center gap-1.5 text-caption font-bold text-[#1e3932] uppercase tracking-wider group-hover:translate-x-1 transition"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
