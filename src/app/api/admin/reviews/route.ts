import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const reviews = await prisma.productReview.findMany({
    include: { product: { select: { id: true, title: true, handle: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    ok: true,
    reviews: reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      productTitle: r.product.title,
      productHandle: r.product.handle,
      rating: r.rating,
      authorName: r.authorName,
      authorEmail: r.authorEmail,
      title: r.title,
      comment: r.comment,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({})) as { id?: number; status?: 'APPROVED' | 'REJECTED' | 'PENDING'; action?: 'delete' };
  if (!body.id) return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });

  if (body.action === 'delete') {
    await prisma.productReview.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true, message: 'Review deleted successfully' });
  }

  if (!body.status || !['APPROVED', 'REJECTED', 'PENDING'].includes(body.status)) {
    return NextResponse.json({ error: 'Valid status is required' }, { status: 400 });
  }

  const updated = await prisma.productReview.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json({ ok: true, review: updated });
}
