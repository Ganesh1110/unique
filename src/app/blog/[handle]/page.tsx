import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: { handle: string } }) {
  const { handle } = params;
  const article = await prisma.article.findUnique({ where: { handle } });

  if (!article) notFound();

  const imgUrl = article.image
    ? typeof article.image === 'string' && article.image.startsWith('{')
      ? (JSON.parse(article.image) as any)?.url
      : article.image
    : '/placeholder.svg';

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-body-xs font-bold text-neutral-600 hover:text-neutral-950">
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>

        <header className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption font-bold text-[#1e3932] uppercase tracking-wider">
            <span>{article.author || 'AURA Atelier'}</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="font-heading text-display-md font-extrabold tracking-tight text-neutral-950 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-body-lg text-neutral-600 font-serif italic">
              {article.excerpt}
            </p>
          )}
        </header>

        {imgUrl && (
          <div className="relative aspect-[16/9] bg-neutral-100 rounded-2xl overflow-hidden shadow-lg">
            <img src={imgUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <article className="prose prose-neutral max-w-none text-neutral-800 text-body leading-relaxed space-y-6">
          <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </article>
      </main>

      <Footer />
    </div>
  );
}
