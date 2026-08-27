import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validation';

export async function GET(req: Request, { params }: { params: { handle: string } }) {
  const { handle } = params;
  if (!handle) return NextResponse.json({ error: 'Product handle is required' }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { handle }, select: { id: true } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const reviews = await prisma.productReview.findMany({
    where: { productId: product.id, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : 0;

  return NextResponse.json({
    ok: true,
    averageRating,
    totalReviews,
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      authorName: r.authorName,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: Request, { params }: { params: { handle: string } }) {
  const { handle } = params;
  if (!handle) return NextResponse.json({ error: 'Product handle is required' }, { status: 400 });

  const bodyRaw = await req.json().catch(() => ({}));
  const validation = reviewSchema.safeParse(bodyRaw);

  if (!validation.success) {
    const errorMsg = validation.error.errors[0]?.message || 'Invalid review data';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { handle }, select: { id: true } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const review = await prisma.productReview.create({
    data: {
      productId: product.id,
      rating: validation.data.rating,
      authorName: validation.data.authorName,
      authorEmail: validation.data.authorEmail,
      title: validation.data.title || null,
      comment: validation.data.comment,
      status: 'PENDING', // requires admin approval
    },
  });

  return NextResponse.json({
    ok: true,
    message: 'Thank you for your review! It has been submitted for moderation and will appear shortly.',
    reviewId: review.id,
  });
}
