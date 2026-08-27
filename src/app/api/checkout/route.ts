import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { gidToId, toImage } from '@/lib/db-mappers';
import { applyMovement, InsufficientStockError } from '@/lib/inventory';
import { checkoutSchema } from '@/lib/validation';

export async function POST(req: Request) {
  const bodyRaw = await req.json().catch(() => ({}));
  const validation = checkoutSchema.safeParse(bodyRaw);

  if (!validation.success) {
    const errorMsg = validation.error.errors[0]?.message || 'Invalid request body';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const body = validation.data;
  const id = gidToId(body.cartId);
  if (id == null) return NextResponse.json({ error: 'Invalid cart id' }, { status: 400 });

  const cart = await prisma.cart.findUnique({
    where: { id },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });
  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
  const lines = cart.items.filter((i) => i.quantity > 0);
  if (lines.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

  const name = body.customerName?.trim() || 'Guest Customer';
  const email = body.customerEmail?.trim() || '';
  const phone = body.customerPhone?.trim() || '';
  const addressJson = body.address || null;

  // Validate guest account creation password requirement
  if (body.createAccount && email) {
    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ error: 'Password of at least 6 characters is required to create an account' }, { status: 400 });
    }
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Calculate subtotal
      const subtotal = lines.reduce((sum, l) => sum + Number(l.variant.price) * l.quantity, 0);
      const currency = lines[0].variant.currencyCode || 'INR';

      // Load settings for Tax (GST) & Shipping calculation
      const settings = await tx.setting.findMany();
      const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
      const freeShippingThreshold = Number(settingsMap.get('free_shipping_threshold') || '2999');
      const flatShippingRate = Number(settingsMap.get('flat_shipping_rate') || '100');
      const gstRate = Number(settingsMap.get('gst_rate') || '5');

      const shipping = subtotal >= freeShippingThreshold ? 0 : flatShippingRate;
      const tax = Math.round((subtotal * (gstRate / 100)) * 100) / 100;
      const discount = 0;
      const total = subtotal - discount + tax + shipping;

      const created = await tx.order.create({
        data: {
          orderNumber: '',
          status: 'Processing',
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          address: addressJson ? JSON.stringify(addressJson) : null,
          subtotal,
          tax,
          discount,
          shipping,
          total,
          currencyCode: currency,
          paymentMethod: 'COD',
          items: {
            create: lines.map((l) => ({
              product: { connect: { id: l.variant.productId } },
              variant: { connect: { id: l.variant.id } },
              title: l.variant.title,
              handle: l.variant.product.handle,
              price: Number(l.variant.price),
              quantity: l.quantity,
              image: l.variant.image ? JSON.stringify(l.variant.image) : null,
              customizations: l.customizations || null,
            })),
          },
        },
        include: { items: { include: { variant: true } } },
      });

      const orderNumber = `#${1000 + created.id}`;
      const updatedOrder = await tx.order.update({
        where: { id: created.id },
        data: { orderNumber },
        include: { items: { include: { variant: true } } },
      });

      for (const l of lines) {
        await applyMovement({ variantId: l.variant.id, type: 'SALE', quantity: l.quantity, reference: orderNumber }, tx);
      }

      // If guest user opted to create account during checkout
      if (body.createAccount && email && body.password) {
        const existingCustomer = await tx.customer.findUnique({ where: { email } });
        if (!existingCustomer) {
          const bcrypt = await import('bcryptjs');
          const passwordHash = await bcrypt.hash(body.password, 10);
          await tx.customer.create({
            data: {
              email,
              name,
              passwordHash,
            },
          });
        }
      }

      await tx.cart.delete({ where: { id } });
      return updatedOrder;
    });

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        name: order.customerName,
        email: order.customerEmail,
        createdAt: order.createdAt.toISOString(),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shipping: Number(order.shipping),
        total: Number(order.total),
        currencyCode: order.currencyCode,
        status: order.status,
        lineItems: order.items.map((i) => ({
          title: i.title,
          image: (i.image as { url?: string } | null)?.url || (typeof i.image === 'string' && i.image.startsWith('{') ? (JSON.parse(i.image) as any)?.url : i.image) || '/placeholder.svg',
          quantity: i.quantity,
          variantTitle: i.variant?.title ?? null,
          customizations: i.customizations ? JSON.parse(i.customizations) : null,
        })),
      },
    });
  } catch (e) {
    if (e instanceof InsufficientStockError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }
}