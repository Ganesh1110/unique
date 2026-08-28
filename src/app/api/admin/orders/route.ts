import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { StoredOrder } from '@/types/admin';

function parseAddress(addr: string | null): { addressLine?: string; city?: string; state?: string; pincode?: string } | undefined {
  if (!addr) return undefined;
  try {
    const parsed = JSON.parse(addr);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch {}
  return { addressLine: addr, city: 'Mumbai', state: 'Maharashtra', pincode: '400001' };
}

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { variant: true } } },
  });
  const mapped: StoredOrder[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    name: o.customerName,
    email: o.customerEmail,
    phone: o.customerPhone ?? undefined,
    address: parseAddress(o.address),
    paymentMethod: o.paymentMethod,
    subtotal: Number(o.subtotal),
    tax: Number(o.tax),
    shipping: Number(o.shipping),
    total: Number(o.total),
    currencyCode: o.currencyCode,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    lineItems: o.items.map((i) => ({
      title: i.title,
      image: (i.image as { url?: string } | null)?.url || '/placeholder.svg',
      quantity: i.quantity,
      price: Number(i.price),
      variantTitle: i.variant?.title ?? null,
    })),
  }));
  return NextResponse.json(mapped);
}