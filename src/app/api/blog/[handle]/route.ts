import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { handle: string } }) {
  const { handle } = params;
  if (!handle) return NextResponse.json({ error: 'Article handle is required' }, { status: 400 });

  const article = await prisma.article.findUnique({
    where: { handle },
  });

  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

  return NextResponse.json({
    ok: true,
    article: {
      id: article.id,
      handle: article.handle,
      title: article.title,
      excerpt: article.excerpt,
      contentHtml: article.contentHtml,
      image: article.image ? (typeof article.image === 'string' && article.image.startsWith('{') ? (JSON.parse(article.image) as any)?.url : article.image) : '/placeholder.svg',
      author: article.author,
      publishedAt: article.publishedAt.toISOString(),
    },
  });
}
