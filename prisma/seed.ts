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
    handle: 'airism-cotton-t-shirt',
    title: 'AIRism Cotton Oversized T-Shirt',
    productType: 'T-Shirts',
    vendor: 'AURA LifeWear',
    price: 990,
    compareAtPrice: 1490,
    description: 'Smooth AIRism fabric with the natural look of cotton. Featuring quick-drying DRY technology and a relaxed, drop-shoulder silhouette.',
    collection: 'tops',
    tags: ['airism', 't-shirt', 'cotton', 'bestseller', 'women', 'men'],
    material: '53% Cotton, 47% Polyester (AIRism)',
    totalInventory: 45,
    options: [
      { name: 'Color', values: ['Off White', 'Black', 'Navy', 'Olive'] },
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
    ],
    variants: [
      { title: 'S / Off White', price: 990, selectedOptions: [{ name: 'Size', value: 'S' }, { name: 'Color', value: 'Off White' }], stock: 12 },
      { title: 'M / Off White', price: 990, selectedOptions: [{ name: 'Size', value: 'M' }, { name: 'Color', value: 'Off White' }], stock: 15 },
      { title: 'L / Black', price: 990, selectedOptions: [{ name: 'Size', value: 'L' }, { name: 'Color', value: 'Black' }], stock: 10 },
      { title: 'XL / Navy', price: 990, selectedOptions: [{ name: 'Size', value: 'XL' }, { name: 'Color', value: 'Navy' }], stock: 8 },
    ],
  },
  {
    handle: 'waffle-easy-pants',
    title: 'Waffle Easy Pants',
    productType: 'Bottoms',
    vendor: 'AURA LifeWear',
    price: 1490,
    compareAtPrice: 1990,
    description: 'All-day comfort with a stretchy waffle knit texture, smooth hand-feel, and an easy straight-leg cut.',
    collection: 'bottoms',
    tags: ['waffle', 'pants', 'bottoms', 'loungewear', 'women'],
    material: '60% Cotton, 40% Polyester',
    totalInventory: 30,
    options: [
      { name: 'Color', values: ['Natural Beige', 'Black', 'Olive'] },
      { name: 'Size', values: ['S', 'M', 'L'] },
    ],
  },
  {
    handle: 'linen-blend-open-collar-shirt',
    title: 'Linen Blend Open Collar Shirt',
    productType: 'Shirts',
    vendor: 'AURA LifeWear',
    price: 1990,
    compareAtPrice: 2490,
    description: 'Airy linen blended with soft rayon for a breezy drape. Perfect for warm-weather layering.',
    collection: 'tops',
    tags: ['linen', 'shirt', 'summer', 'men', 'women'],
    material: '55% Linen, 45% Rayon',
    totalInventory: 22,
  },
  {
    handle: 'sweat-crew-neck-shirt',
    title: 'Sweat Crew Neck Long Sleeve Shirt',
    productType: 'Sweatshirts',
    vendor: 'AURA LifeWear',
    price: 1990,
    description: 'Classic French terry loopback cotton. Durable ribbed cuffs and neckline crafted for everyday wear.',
    collection: 'tops',
    tags: ['sweatshirt', 'cotton', 'casual', 'men', 'women'],
    material: '100% Loopback Cotton',
    totalInventory: 28,
  },
  {
    handle: 'ultra-light-down-jacket',
    title: 'Ultra Light Down Jacket',
    productType: 'Outerwear',
    vendor: 'AURA LifeWear',
    price: 4990,
    compareAtPrice: 5990,
    description: 'Incredibly lightweight yet warm down insulation with water-repellent finish. Packs down into its own compact pouch.',
    collection: 'outerwear',
    tags: ['jacket', 'down', 'winter', 'outerwear'],
    material: '100% Nylon Shell, Premium Down Fill',
    totalInventory: 18,
  },
  {
    handle: 'merino-blend-cardigan',
    title: 'Extra Fine Merino V-Neck Cardigan',
    productType: 'Knitwear',
    vendor: 'AURA LifeWear',
    price: 2990,
    description: 'Ultra-fine 19.5 micron merino wool yarn with a smooth luster and machine-washable convenience.',
    collection: 'tops',
    tags: ['merino', 'wool', 'cardigan', 'knitwear'],
    material: '100% Extra Fine Merino Wool',
    totalInventory: 25,
  },
  {
    handle: 'pleated-midi-skirt',
    title: 'Chiffon Pleated Midi Skirt',
    productType: 'Dresses & Skirts',
    vendor: 'AURA LifeWear',
    price: 2490,
    description: 'Elegant accordion pleats crafted in lightweight chiffon with a comfortable elastic waistband.',
    collection: 'dresses',
    tags: ['skirt', 'pleated', 'women', 'elegance'],
    material: '100% Polyester Chiffon',
    totalInventory: 20,
  },
  {
    handle: 'stretch-chino-pants',
    title: 'Smart Ankle Stretch Chino Pants',
    productType: 'Bottoms',
    vendor: 'AURA LifeWear',
    price: 2490,
    compareAtPrice: 2990,
    description: '2-way stretch fabric for freedom of movement with a clean center crease suitable for smart or casual occasions.',
    collection: 'bottoms',
    tags: ['chino', 'pants', 'smart', 'men', 'women'],
    material: '96% Cotton, 4% Elastane',
    totalInventory: 35,
  },
];

const collections = [
  { handle: 'new-arrivals', title: 'New Arrivals', description: 'Fresh seasonal drops and LifeWear innovations.' },
  { handle: 'tops', title: 'T-Shirts & Tops', description: 'AIRism cotton tees, polo shirts, and casual tops.' },
  { handle: 'bottoms', title: 'Bottoms & Pants', description: 'Comfortable waffle pants, chinos, and jeans.' },
  { handle: 'outerwear', title: 'Outerwear & Jackets', description: 'Ultra light down coats, blazers, and jackets.' },
  { handle: 'dresses', title: 'Dresses & Skirts', description: 'Breezy dresses and elegant pleated skirts.' },
];

const articles = [
  {
    handle: 'buying-diamonds',
    title: 'The Complete Guide to Buying Diamonds',
    excerpt: 'Cut, color, clarity and carat — demystifying the 4Cs so you can choose with confidence.',
    contentHtml: '<p>The journey to the perfect diamond starts long before you see it sparkle. Understanding the four Cs — cut, color, clarity and carat — gives you the language to evaluate any stone on its merits.</p><p><strong>Cut</strong> is the single most important factor. <strong>Color</strong> grades from D (colourless) to Z. <strong>Clarity</strong> describes internal inclusions. And <strong>carat</strong> is simply weight.</p><p>At AURA, every diamond is ethically sourced and certified by GIA or IGI.</p>',
    author: 'Ananya Iyer',
    publishedAt: '2024-05-18T00:00:00Z',
  },
  {
    handle: 'care-for-gold-jewelry',
    title: 'How to Care for Your Gold Jewelry',
    excerpt: 'Simple rituals to keep your gold pieces brilliant for a lifetime.',
    contentHtml: '<p>Gold is one of the most durable metals on earth, but it still deserves a little attention.</p><p>Avoid wearing jewelry while swimming or doing heavy chores. Store each piece separately to prevent scratches. To clean, soak in warm soapy water, brush gently with a soft toothbrush, and rinse well.</p><p>Bring your pieces to us once a year for a complimentary professional polish.</p>',
    author: 'Ananya Iyer',
    publishedAt: '2024-04-02T00:00:00Z',
  },
  {
    handle: 'story-behind-pearls',
    title: 'The Story Behind Our Akoya Pearls',
    excerpt: 'From oyster to heirloom — how a pearl is born and how we choose ours.',
    contentHtml: '<p>Each Akoya pearl begins as a tiny bead placed inside an oyster, which then coats it with layer after layer of lustrous nacre.</p><p>We select only pearls with a mirror-like surface and a warm pink overtone, then hand-knot each strand on silk. It is a craft that takes years to master — and the result is a piece that will pass through generations.</p>',
    author: 'Meera Nair',
    publishedAt: '2024-03-12T00:00:00Z',
  },
  {
    handle: 'layering-jewelry',
    title: 'The Art of Layering Jewelry',
    excerpt: 'A modern guide to mixing chains, lengths and textures like a pro.',
    contentHtml: '<p>Layering is the fastest way to make jewelry feel personal. The rule of thumb: mix at least two lengths, vary the textures, and let one statement piece lead.</p><p>Start with a short choker or pendant, add a mid-length chain, and finish with a long piece that grazes the chest. Combine gold tones with pearls or a single gemstone for contrast.</p>',
    author: 'Meera Nair',
    publishedAt: '2024-02-20T00:00:00Z',
  },
];

function image(seed: string, width = 1200, height = 1500) {
  return {
    id: `gid://db/MediaImage/${seed}`,
    url: `https://picsum.photos/seed/sss-${seed}/${width}/${height}`,
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
    { key: 'shop.description', value: 'Curated jewelry for the modern collector.', label: '', hint: '' },
    { key: 'shop.shortDescription', value: 'Founded in Mumbai, AURA began with a simple belief: jewelry should be more than adornment. It should be a reflection of your journey.', label: '', hint: '' },
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
      create: { handle: c.handle, title: c.title, description: c.description, descriptionHtml: `<p>${c.description}</p>`, image: image(`col-${c.handle}`, 1600, 1200), seo: { title: c.title, description: c.description } },
    });
    collectionMap.set(c.handle, row.id);
  }

  for (const spec of products) {
    const images = [image(spec.handle), image(`${spec.handle}-b`), image(`${spec.handle}-c`)];
    const product = await prisma.product.upsert({
      where: { handle: spec.handle },
      update: {
        title: spec.title,
        description: spec.description,
        descriptionHtml: `<p>${spec.description}</p>`,
        vendor: spec.vendor,
        productType: spec.productType,
        tags: spec.tags,
        price: spec.price,
        compareAtPrice: spec.compareAtPrice ?? null,
        currencyCode: CURRENCY,
        totalInventory: spec.totalInventory ?? 25,
        featuredImage: images[0],
        images,
        options: spec.options
          ? spec.options.map((o, i) => ({ id: `gid://db/ProductOption/${spec.handle}-${i}`, name: o.name, values: o.values }))
          : [{ id: `gid://db/ProductOption/${spec.handle}-material`, name: 'Material', values: [spec.material] }],
        seo: { title: spec.title, description: spec.description },
        publishedAt: new Date('2024-06-01T00:00:00Z'),
      },
      create: {
        handle: spec.handle,
        title: spec.title,
        description: spec.description,
        descriptionHtml: `<p>${spec.description}</p>`,
        vendor: spec.vendor,
        productType: spec.productType,
        tags: spec.tags,
        price: spec.price,
        compareAtPrice: spec.compareAtPrice ?? null,
        currencyCode: CURRENCY,
        totalInventory: spec.totalInventory ?? 25,
        featuredImage: images[0],
        images,
        options: spec.options
          ? spec.options.map((o, i) => ({ id: `gid://db/ProductOption/${spec.handle}-${i}`, name: o.name, values: o.values }))
          : [{ id: `gid://db/ProductOption/${spec.handle}-material`, name: 'Material', values: [spec.material] }],
        seo: { title: spec.title, description: spec.description },
        publishedAt: new Date('2024-06-01T00:00:00Z'),
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
        image: image(`article-${a.handle}`, 1200, 800),
        author: a.author,
        publishedAt: new Date(a.publishedAt),
        seo: { title: a.title, description: a.excerpt },
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