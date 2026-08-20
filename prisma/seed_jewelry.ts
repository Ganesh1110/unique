import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const CURRENCY = 'INR';

interface ProductSeed {
  handle: string;
  title: string;
  productType: string;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  collection: string;
  tags: string[];
  material: string;
  totalInventory?: number;
}

const products: ProductSeed[] = [
  {
    handle: 'the-solitaire-pendant',
    title: 'The Solitaire Pendant',
    productType: 'Pendants',
    vendor: 'AURA Atelier',
    price: 45000,
    compareAtPrice: 52000,
    description: 'A single brilliant-cut diamond suspended from an 18k yellow gold chain.',
    collection: 'pendants',
    tags: ['diamond', 'pendant', 'gold', 'solitaire'],
    material: '18k Yellow Gold & Diamond',
    totalInventory: 15,
  },
  {
    handle: 'rose-quartz-pendant',
    title: 'Rose Quartz Pendant',
    productType: 'Pendants',
    vendor: 'AURA Atelier',
    price: 28000,
    compareAtPrice: 34000,
    description: 'A soft pink rose quartz cabochon set in 14k rose gold.',
    collection: 'pendants',
    tags: ['rose-quartz', 'pendant', 'rose-gold'],
    material: '14k Rose Gold',
    totalInventory: 20,
  },
  {
    handle: 'sapphire-halo-pendant',
    title: 'Sapphire Halo Pendant',
    productType: 'Pendants',
    vendor: 'AURA Atelier',
    price: 62000,
    description: 'Deep blue Ceylon sapphire encircled by a halo of pavé diamonds.',
    collection: 'pendants',
    tags: ['sapphire', 'pendant', 'halo', 'diamond'],
    material: '18k White Gold',
    totalInventory: 10,
  },
  {
    handle: 'classic-diamond-studs',
    title: 'Classic Diamond Studs',
    productType: 'Earrings',
    vendor: 'AURA Atelier',
    price: 38000,
    compareAtPrice: 42000,
    description: 'Timeless round-cut lab-grown diamond stud earrings set in platinum.',
    collection: 'earrings',
    tags: ['diamond', 'studs', 'earrings', 'platinum'],
    material: 'Platinum',
    totalInventory: 25,
  },
  {
    handle: 'emerald-cut-diamond-ring',
    title: 'Emerald Cut Diamond Engagement Ring',
    productType: 'Rings',
    vendor: 'AURA Atelier',
    price: 125000,
    compareAtPrice: 140000,
    description: '1.5-carat emerald cut diamond set on a tapered yellow gold band.',
    collection: 'rings',
    tags: ['diamond', 'ring', 'engagement', 'emerald-cut'],
    material: '18k Yellow Gold',
    totalInventory: 8,
  },
];

const collections = [
  { handle: 'pendants', title: 'Pendants & Necklaces', description: 'Fine gold and diamond pendants handcrafted in Mumbai.' },
  { handle: 'rings', title: 'Rings & Bands', description: 'Solitaire engagement rings and stackable gold bands.' },
  { handle: 'earrings', title: 'Earrings', description: 'Diamond studs, hoops, and gemstone drop earrings.' },
];

async function main() {
  console.log('Seeding original Jewelry Database...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sss.com';
  const passwordHash = await hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, name: 'Jewelry Store Owner', passwordHash },
  });

  for (const c of collections) {
    await prisma.collection.upsert({
      where: { handle: c.handle },
      update: { title: c.title, description: c.description },
      create: {
        handle: c.handle,
        title: c.title,
        description: c.description,
        descriptionHtml: `<p>${c.description}</p>`,
      },
    });
  }

  for (const spec of products) {
    await prisma.product.upsert({
      where: { handle: spec.handle },
      update: { title: spec.title, description: spec.description, price: spec.price },
      create: {
        handle: spec.handle,
        title: spec.title,
        description: spec.description,
        descriptionHtml: `<p>${spec.description}</p>`,
        vendor: spec.vendor,
        productType: spec.productType,
        tags: JSON.stringify(spec.tags),
        price: spec.price,
        compareAtPrice: spec.compareAtPrice ?? null,
        currencyCode: CURRENCY,
        totalInventory: spec.totalInventory ?? 25,
      },
    });
  }

  console.log('Jewelry database seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
