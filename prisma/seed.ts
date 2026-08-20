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
  options?: Array<{ name: string; values: string[] }>;
  variants?: Array<{ title: string; price: number; selectedOptions: Array<{ name: string; value: string }>; stock?: number }>;
}

const VARIANT_DEFAULT_STOCK = 25;

async function upsertVariants(
  productId: number,
  skuBase: string,
  specs: Array<{ title: string; price: number; selectedOptions: Array<{ name: string; value: string }>; stock?: number }>
) {
  // Keep variants that are referenced by orders/cart lines (RESTRICT FK) so we never
  // drop order history; everything else for this product is regenerated below.
  const referenced = await prisma.productVariant.findMany({
    where: { productId, OR: [{ orderItems: { some: {} } }, { cartItems: { some: {} } }] },
    select: { id: true },
  });
  const referencedIds = referenced.map((v) => v.id);
  const baseWhere = referencedIds.length > 0
    ? { productId, id: { notIn: referencedIds } }
    : { productId };

  await prisma.productVariant.deleteMany({ where: baseWhere });

  for (const s of specs) {
    const sku = `${skuBase}-${s.title.toUpperCase().replace(/[^A-Z0-9]+/g, '')}`;
    const stock = s.stock ?? VARIANT_DEFAULT_STOCK;
    const data = {
      title: s.title,
      sku,
      price: s.price,
      currencyCode: CURRENCY,
      stock,
      selectedOptions: JSON.stringify(s.selectedOptions),
      availableForSale: stock > 0,
    };
    const existing = await prisma.productVariant.findFirst({ where: { productId, sku } });
    if (existing) {
      await prisma.productVariant.update({ where: { id: existing.id }, data });
    } else {
      const v = await prisma.productVariant.create({ data: { ...data, productId } });
      await prisma.inventoryMovement.create({
        data: { variantId: v.id, type: 'RESTOCK', quantity: v.stock, note: 'Initial stock', reference: 'seed' },
      });
    }
  }

  // Drop the backfilled "Default Title" placeholder variant if it is no longer wanted.
  const cleanupWhere = referencedIds.length > 0
    ? { productId, title: 'Default Title', id: { notIn: referencedIds } }
    : { productId, title: 'Default Title' };
  await prisma.productVariant.deleteMany({ where: cleanupWhere });
}

const products: ProductSeed[] = [
  {
    handle: 'kanjeevaram-pure-silk-saree',
    title: 'Kanjeevaram Pure Mulberry Silk Saree',
    productType: 'Sarees',
    vendor: 'AURA Heritage',
    price: 12990,
    compareAtPrice: 16990,
    description: 'Handwoven in Kanchipuram with pure 3-ply mulberry silk and gold zari pallu work. Includes unstitched contrast blouse piece.',
    collection: 'sarees',
    tags: ['saree', 'kanjeevaram', 'silk-saree', 'bridal', 'bestseller', 'women'],
    material: 'Pure Mulberry Silk & Gold Zari',
    totalInventory: 20,
    options: [
      { name: 'Color', values: ['Royal Crimson Red', 'Emerald Green', 'Deep Peacock Blue'] },
      { name: 'Blouse Option', values: ['Unstitched Blouse Piece', 'Custom Stitched Blouse'] },
    ],
    variants: [
      { title: 'Royal Crimson Red / Unstitched', price: 12990, selectedOptions: [{ name: 'Color', value: 'Royal Crimson Red' }, { name: 'Blouse Option', value: 'Unstitched Blouse Piece' }], stock: 10 },
      { title: 'Emerald Green / Unstitched', price: 12990, selectedOptions: [{ name: 'Color', value: 'Emerald Green' }, { name: 'Blouse Option', value: 'Unstitched Blouse Piece' }], stock: 5 },
      { title: 'Deep Peacock Blue / Unstitched', price: 12990, selectedOptions: [{ name: 'Color', value: 'Deep Peacock Blue' }, { name: 'Blouse Option', value: 'Unstitched Blouse Piece' }], stock: 5 },
    ],
  },
  {
    handle: 'banarasi-zari-brocade-saree',
    title: 'Banarasi Zari Brocade Katan Silk Saree',
    productType: 'Sarees',
    vendor: 'AURA Heritage',
    price: 14490,
    compareAtPrice: 18990,
    description: 'Rich Banarasi weave featuring intricate Kadwa floral bootis and silver zari borders. Perfect for grand festive occasions.',
    collection: 'sarees',
    tags: ['saree', 'banarasi', 'silk-saree', 'wedding', 'women'],
    material: 'Pure Katan Silk',
    totalInventory: 15,
  },
  {
    handle: 'chanderi-floral-organza-saree',
    title: 'Chanderi Hand-Printed Tissue Organza Saree',
    productType: 'Sarees',
    vendor: 'AURA Heritage',
    price: 6990,
    compareAtPrice: 8990,
    description: 'Sheer tissue organza saree adorned with delicate hand-block floral motifs and scalloped gold border selvedge.',
    collection: 'sarees',
    tags: ['saree', 'organza', 'chanderi', 'summer', 'women'],
    material: 'Tissue Silk Organza',
    totalInventory: 25,
  },
  {
    handle: 'handloom-pure-linen-saree',
    title: 'Handloom Pure Linen Saree with Zari Border',
    productType: 'Sarees',
    vendor: 'AURA Everyday',
    price: 3990,
    compareAtPrice: 5490,
    description: 'Breathable 100-count pure linen saree featuring subtle silver zari selvedge. Lightweight and comfortable for all-day wear.',
    collection: 'sarees',
    tags: ['saree', 'linen', 'casual', 'everyday', 'women'],
    material: '100 Count Pure Linen',
    totalInventory: 30,
  },
  {
    handle: 'georgette-embroidered-designer-saree',
    title: 'Georgette Embroidered Partywear Saree',
    productType: 'Sarees',
    vendor: 'AURA Atelier',
    price: 8490,
    compareAtPrice: 11990,
    description: 'Fluid viscose georgette draped saree highlighted with delicate sequins hand-embroidery along the border.',
    collection: 'sarees',
    tags: ['saree', 'georgette', 'designer', 'partywear', 'women'],
    material: 'Viscose Georgette',
    totalInventory: 18,
  },
  {
    handle: 'bridal-velvet-lehenga-set',
    title: 'Bridal Velvet Embroidered Lehenga Set',
    productType: 'Lehengas',
    vendor: 'AURA Atelier',
    price: 24990,
    compareAtPrice: 32990,
    description: 'Opulent velvet lehenga flared with zardozi threadwork, paired with a matching blouse and net dupatta.',
    collection: 'lehengas',
    tags: ['lehenga', 'bridal', 'velvet', 'festive', 'women'],
    material: 'Silk Velvet & Net',
    totalInventory: 10,
  },
  {
    handle: 'airism-cotton-t-shirt',
    title: 'AIRism Cotton Oversized T-Shirt',
    productType: 'T-Shirts',
    vendor: 'AURA LifeWear',
    price: 990,
    compareAtPrice: 1490,
    description: 'Smooth AIRism fabric with the natural look of cotton. Featuring quick-drying DRY technology.',
    collection: 'tops',
    tags: ['airism', 't-shirt', 'tops', 'women', 'men'],
    material: '53% Cotton, 47% Polyester',
    totalInventory: 40,
  },
  {
    handle: 'waffle-easy-pants',
    title: 'Waffle Easy Pants',
    productType: 'Bottoms',
    vendor: 'AURA LifeWear',
    price: 1490,
    compareAtPrice: 1990,
    description: 'Stretchy waffle knit texture straight-leg pants for all-day comfort.',
    collection: 'bottoms',
    tags: ['waffle', 'pants', 'bottoms', 'women'],
    material: '60% Cotton, 40% Polyester',
    totalInventory: 30,
  },
];

const collections = [
  { handle: 'sarees', title: 'Sarees Collection', description: 'Handcrafted Kanjeevaram, Banarasi, Organza & Linen Sarees.' },
  { handle: 'silk-sarees', title: 'Silk Sarees', description: 'Pure Mulberry Silk & Zari Weave Heritage Sarees.' },
  { handle: 'lehengas', title: 'Lehengas & Festive', description: 'Bridal velvet lehengas & embroidered ethnic sets.' },
  { handle: 'tops', title: 'Tops & Tunics', description: 'Everyday AIRism tops, cotton tunics & casual wear.' },
  { handle: 'bottoms', title: 'Bottoms & Pants', description: 'Comfortable waffle pants and chinos.' },
];

const articles = [
  {
    handle: 'airism-technology',
    title: 'The Science Behind AIRism Fabric Technology',
    excerpt: 'Breathable, moisture-wicking micro-polyester fibers engineered for all-day comfort.',
    contentHtml: '<p>AIRism is engineered with micro-fibers one-tenth the width of a human hair. The ultra-fine synthetic structure wicks away sweat instantaneously while maintaining the soft, smooth touch of natural long-staple cotton.</p><p>Whether layering under outerwear or wearing as a standalone staple, AIRism adjusts dynamically to your body temperature.</p>',
    author: 'AURA Innovations',
    publishedAt: '2024-05-18T00:00:00Z',
  },
  {
    handle: 'styling-waffle-pants',
    title: 'How to Style Waffle Easy Pants for Work & Leisure',
    excerpt: 'Transitioning texture-knit pants from weekend lounging to smart casual outfits.',
    contentHtml: '<p>Waffle knit texture brings depth to minimalist silhouettes. Pair your Waffle Easy Pants with an open-collar linen shirt for effortless weekend brunching, or layer with a structured trench coat for airport travels.</p>',
    author: 'AURA Styling Team',
    publishedAt: '2024-04-02T00:00:00Z',
  },
  {
    handle: 'merino-wool-care',
    title: 'Care & Washing Guide for Extra Fine Merino Wool',
    excerpt: 'Simple steps to keep your merino wool cardigans soft and pill-free for years.',
    contentHtml: '<p>Extra Fine Merino Wool fibers are naturally elastic and stain-resistant. Wash inside out in a mesh laundry bag on a gentle wool cycle with cold water, and lay flat to dry in shade.</p>',
    author: 'AURA Care Guide',
    publishedAt: '2024-03-12T00:00:00Z',
  },
];

const apparelImageMap: Record<string, string> = {
  'airism-cotton-t-shirt': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop',
  'waffle-easy-pants': 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=1200&auto=format&fit=crop',
  'linen-blend-open-collar-shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&auto=format&fit=crop',
  'sweat-crew-neck-shirt': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&auto=format&fit=crop',
  'ultra-light-down-jacket': 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&auto=format&fit=crop',
  'merino-blend-cardigan': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&auto=format&fit=crop',
  'pleated-midi-skirt': 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&auto=format&fit=crop',
  'stretch-chino-pants': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&auto=format&fit=crop',
};

function image(seed: string, width = 1200, height = 1500) {
  const baseKey = seed.replace(/^col-/, '').replace(/-b$|-c$/, '');
  const url = apparelImageMap[baseKey] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop';
  return {
    id: `gid://db/MediaImage/${seed}`,
    url,
    altText: null,
    width,
    height,
  };
}

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sss.com';
  const passwordHash = await hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, name: 'Store Owner', passwordHash },
  });

  const settings: Array<{ key: string; value: string; label: string; hint: string }> = [
    { key: 'store_name', value: 'AURA', label: 'Store Name', hint: 'Shown in the storefront header and metadata' },
    { key: 'store_email', value: 'hello@aura.com', label: 'Store Email', hint: 'Used for order notifications and contact form' },
    { key: 'currency', value: 'INR (₹)', label: 'Currency', hint: 'Currency for pricing and inventory valuation' },
    { key: 'free_shipping_threshold', value: '₹15,000', label: 'Free Shipping Above', hint: 'Complimentary shipping above this cart value' },
    { key: 'return_window', value: '14 days', label: 'Return Window', hint: 'Return period shown on the PDP and checkout' },
    { key: 'low_stock_alerts', value: 'true', label: '', hint: '' },
    { key: 'new_order_alerts', value: 'true', label: '', hint: '' },
    { key: 'shop.name', value: 'AURA', label: '', hint: '' },
    { key: 'shop.description', value: 'Simple, high-quality, everyday clothing designed to make life better.', label: '', hint: '' },
    { key: 'shop.shortDescription', value: 'AURA LifeWear is designed for comfortable living — timeless essentials crafted with precision, quality, and style.', label: '', hint: '' },
    { key: 'shop.currencyCode', value: 'INR', label: '', hint: '' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  const collectionMap = new Map<string, number>();
  for (const c of collections) {
    const row = await prisma.collection.upsert({
      where: { handle: c.handle },
      update: { title: c.title, description: c.description },
      create: { handle: c.handle, title: c.title, description: c.description, descriptionHtml: `<p>${c.description}</p>`, image: JSON.stringify(image(`col-${c.handle}`, 1600, 1200)), seo: JSON.stringify({ title: c.title, description: c.description }) },
    });
    collectionMap.set(c.handle, row.id);
  }

  for (const spec of products) {
    const images = [image(spec.handle), image(`${spec.handle}-b`), image(`${spec.handle}-c`)];
    const productData = {
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
      featuredImage: JSON.stringify(images[0]),
      images: JSON.stringify(images),
      options: JSON.stringify(
        spec.options
          ? spec.options.map((o, i) => ({ id: `gid://db/ProductOption/${spec.handle}-${i}`, name: o.name, values: o.values }))
          : [{ id: `gid://db/ProductOption/${spec.handle}-material`, name: 'Material', values: [spec.material] }]
      ),
      seo: JSON.stringify({ title: spec.title, description: spec.description }),
      publishedAt: new Date('2024-06-01T00:00:00Z'),
    };

    const product = await prisma.product.upsert({
      where: { handle: spec.handle },
      update: productData,
      create: {
        handle: spec.handle,
        ...productData,
      },
    });

    if (spec.variants) {
      await upsertVariants(product.id, spec.handle, spec.variants);
    } else {
      await upsertVariants(product.id, spec.handle, [
        { title: spec.material, price: spec.price, selectedOptions: [{ name: 'Material', value: spec.material }] },
      ]);
    }

    const collectionId = collectionMap.get(spec.collection);
    if (collectionId != null) {
      await prisma.collectionItem.upsert({
        where: { collectionId_productId: { collectionId, productId: product.id } },
        update: {},
        create: { collectionId, productId: product.id, position: product.id },
      });
    }
  }

  const blog = await prisma.blog.upsert({
    where: { handle: 'journal' },
    update: { title: 'Journal' },
    create: { handle: 'journal', title: 'Journal' },
  });
  for (const a of articles) {
    await prisma.article.upsert({
      where: { blogId_handle: { blogId: blog.id, handle: a.handle } },
      update: { title: a.title, excerpt: a.excerpt, contentHtml: a.contentHtml, author: a.author },
      create: {
        blogId: blog.id,
        handle: a.handle,
        title: a.title,
        excerpt: a.excerpt,
        contentHtml: a.contentHtml,
        image: JSON.stringify(image(`article-${a.handle}`, 1200, 800)),
        author: a.author,
        publishedAt: new Date(a.publishedAt),
        seo: JSON.stringify({ title: a.title, description: a.excerpt }),
      },
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());