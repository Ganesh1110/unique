import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productRecordToProduct, gidToId, variantsInclude } from '@/lib/db-mappers';
import { getSession } from '@/lib/auth';

interface ProductBaseUpdate {
  title?: string;
  description?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  images?: string[];
  price?: number;
  compareAtPrice?: number | null;
  availableForSale?: boolean;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = gidToId(params.id);
  if (id == null) return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  const body = await req.json().catch(() => ({})) as ProductBaseUpdate;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const data: any = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) {
    data.description = body.description;
    data.descriptionHtml = `<p>${body.description}</p>`;
  }
  if (body.vendor !== undefined) data.vendor = body.vendor;
  if (body.productType !== undefined) data.productType = body.productType;
  if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
  if (body.images !== undefined && Array.isArray(body.images) && body.images.length > 0) {
    data.featuredImage = JSON.stringify(body.images[0]);
    data.images = JSON.stringify(body.images);
  }
  if (body.price !== undefined) data.price = body.price;
  if (body.compareAtPrice !== undefined) data.compareAtPrice = body.compareAtPrice;
  if (body.availableForSale !== undefined) data.availableForSale = body.availableForSale;

  const updated = await prisma.product.update({
    where: { id },
    data,
    include: variantsInclude,
  });
  return NextResponse.json(productRecordToProduct(updated));
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = gidToId(params.id);
  if (id == null) return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  await prisma.$transaction([
    prisma.product.update({ where: { id }, data: { deletedAt: new Date() } }),
    prisma.productVariant.updateMany({ where: { productId: id }, data: { deletedAt: new Date(), availableForSale: false } }),
  ]);
  return NextResponse.json({ ok: true });
}