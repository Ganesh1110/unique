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

function mapOrder(order: any): StoredOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone ?? undefined,
    address: parseAddress(order.address),
    paymentMethod: order.paymentMethod,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shipping: Number(order.shipping),
    total: Number(order.total),
    currencyCode: order.currencyCode,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    lineItems: order.items.map((i: any) => ({
      title: i.title,
      image: (i.image as { url?: string } | null)?.url || '/placeholder.svg',
      quantity: i.quantity,
      price: Number(i.price),
      variantTitle: i.variant?.title ?? null,
    })),
  };
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { variant: true } } },
  });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const mapped = mapOrder(order);
  return NextResponse.json({ order: mapped, ...mapped });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  const body = await req.json().catch(() => ({})) as { status?: string };
  if (typeof body.status !== 'string') return NextResponse.json({ error: 'status is required' }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status },
    include: { items: { include: { variant: true } } },
  }).catch(() => null);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const mapped = mapOrder(order);
  return NextResponse.json({ order: mapped, ...mapped });
}