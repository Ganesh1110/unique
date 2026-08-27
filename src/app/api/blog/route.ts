import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { blogArticleSchema } from '@/lib/validation';

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return NextResponse.json({
    ok: true,
    articles: articles.map((a) => ({
      id: a.id,
      handle: a.handle,
      title: a.title,
      excerpt: a.excerpt,
      contentHtml: a.contentHtml,
      image: a.image ? (typeof a.image === 'string' && a.image.startsWith('{') ? (JSON.parse(a.image) as any)?.url : a.image) : '/placeholder.svg',
      author: a.author,
      publishedAt: a.publishedAt.toISOString(),
    })),
  });
}

export async function POST(req: Request) {
  const bodyRaw = await req.json().catch(() => ({}));
  const validation = blogArticleSchema.safeParse(bodyRaw);

  if (!validation.success) {
    const errorMsg = validation.error.errors[0]?.message || 'Invalid article data';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const data = validation.data;

  // Ensure default Blog exists
  let blog = await prisma.blog.findFirst({ where: { handle: 'journal' } });
  if (!blog) {
    blog = await prisma.blog.create({
      data: { handle: 'journal', title: 'AURA Journal' },
    });
  }

  const article = await prisma.article.create({
    data: {
      blogId: blog.id,
      handle: data.handle,
      title: data.title,
      excerpt: data.excerpt || '',
      contentHtml: data.contentHtml,
      image: data.image || null,
      author: data.author || 'AURA Atelier',
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, article });
}
