import { NextResponse } from 'next/server';

export interface StoredDiscount {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal?: number;
  active: boolean;
  usedCount: number;
  createdAt: string;
}

const DEFAULT_DISCOUNTS: StoredDiscount[] = [
  { id: '1', code: 'AURA10', type: 'percent', value: 10, minSubtotal: 0, active: true, usedCount: 14, createdAt: '2026-08-01' },
  { id: '2', code: 'FESTIVE15', type: 'percent', value: 15, minSubtotal: 10000, active: true, usedCount: 8, createdAt: '2026-08-05' },
  { id: '3', code: 'HERITAGE20', type: 'percent', value: 20, minSubtotal: 25000, active: true, usedCount: 5, createdAt: '2026-08-10' },
  { id: '4', code: 'WELCOME500', type: 'fixed', value: 500, minSubtotal: 5000, active: true, usedCount: 22, createdAt: '2026-08-12' },
];

let inMemoryDiscounts: StoredDiscount[] = [...DEFAULT_DISCOUNTS];

export async function GET() {
  return NextResponse.json({ discounts: inMemoryDiscounts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, type, value, minSubtotal } = body;
    if (!code || !value) {
      return NextResponse.json({ error: 'Code and value are required' }, { status: 400 });
    }

    const newDiscount: StoredDiscount = {
      id: String(Date.now()),
      code: String(code).toUpperCase().trim(),
      type: type === 'fixed' ? 'fixed' : 'percent',
      value: Number(value),
      minSubtotal: Number(minSubtotal || 0),
      active: true,
      usedCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    inMemoryDiscounts.unshift(newDiscount);
    return NextResponse.json({ success: true, discount: newDiscount });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, active } = await req.json();
    inMemoryDiscounts = inMemoryDiscounts.map((d) => (d.id === id ? { ...d, active: Boolean(active) } : d));
    return NextResponse.json({ success: true, discounts: inMemoryDiscounts });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      inMemoryDiscounts = inMemoryDiscounts.filter((d) => d.id !== id);
    }
    return NextResponse.json({ success: true, discounts: inMemoryDiscounts });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
