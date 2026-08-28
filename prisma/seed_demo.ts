import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const CURRENCY = 'INR';

interface VariantSpec {
  title: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  lowStockThreshold?: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface ProductSeed {
  handle: string;
  title: string;
  productType: string;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  collections: string[];
  tags: string[];
  material: string;
  options: Array<{ name: string; values: string[] }>;
  variants: VariantSpec[];
  images: Array<{ id: string; url: string; altText: string; width: number; height: number }>;
}

const products: ProductSeed[] = [
  // 1. Kanjeevaram Pure Mulberry Silk Saree
  {
    handle: 'kanjeevaram-pure-mulberry-silk-saree',
    title: 'Kanjeevaram Pure Mulberry Silk Saree',
    productType: 'Sarees',
    vendor: 'Sri Varadaraja Guild, Kanchipuram',
    price: 16990,
    compareAtPrice: 21990,
    description: 'Handwoven in Kanchipuram using 3-ply pure mulberry silk and authentic 2G silver-gilt gold zari. Features the auspicious Korvai temple border and a grand Mayil (peacock) motif pallu. Silk Mark & GI certified craft.',
    collections: ['sarees', 'silk-sarees', 'bestsellers', 'wedding-edit'],
    tags: ['saree', 'kanjeevaram', 'silk', 'bridal', 'bestseller', 'handwoven', 'gold-zari'],
    material: 'Pure Mulberry Silk & 2G Gold Zari',
    options: [
      { name: 'Color', values: ['Crimson Red & Gold', 'Emerald Green', 'Peacock Blue'] },
      { name: 'Blouse Option', values: ['Unstitched Piece (80cm)', 'Custom Tailored'] },
    ],
    variants: [
      {
        title: 'Crimson Red & Gold / Unstitched Piece (80cm)',
        sku: 'AUR-KNJ-RED-UNST',
        barcode: '890100100101',
        price: 16990,
        compareAtPrice: 21990,
        stock: 14,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Crimson Red & Gold' }, { name: 'Blouse Option', value: 'Unstitched Piece (80cm)' }],
      },
      {
        title: 'Crimson Red & Gold / Custom Tailored',
        sku: 'AUR-KNJ-RED-STCH',
        barcode: '890100100102',
        price: 18990,
        compareAtPrice: 23990,
        stock: 8,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Crimson Red & Gold' }, { name: 'Blouse Option', value: 'Custom Tailored' }],
      },
      {
        title: 'Emerald Green / Unstitched Piece (80cm)',
        sku: 'AUR-KNJ-GRN-UNST',
        barcode: '890100100103',
        price: 16990,
        compareAtPrice: 21990,
        stock: 6,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Emerald Green' }, { name: 'Blouse Option', value: 'Unstitched Piece (80cm)' }],
      },
      {
        title: 'Peacock Blue / Unstitched Piece (80cm)',
        sku: 'AUR-KNJ-BLU-UNST',
        barcode: '890100100104',
        price: 16990,
        compareAtPrice: 21990,
        stock: 5,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Peacock Blue' }, { name: 'Blouse Option', value: 'Unstitched Piece (80cm)' }],
      },
    ],
    images: [
      { id: 'img-knj-1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Kanjeevaram Pure Mulberry Silk Saree Front Drape', width: 1200, height: 1500 },
      { id: 'img-knj-2', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop', altText: 'Kanjeevaram Silk Gold Zari Pallu Close-up', width: 1200, height: 1500 },
      { id: 'img-knj-3', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop', altText: 'Kanjeevaram Silk Pleat Texture Detail', width: 1200, height: 1500 },
    ],
  },

  // 2. Banarasi Zari Brocade Katan Silk Saree
  {
    handle: 'banarasi-zari-brocade-katan-silk',
    title: 'Banarasi Zari Brocade Katan Silk Saree',
    productType: 'Sarees',
    vendor: 'Banaras Zari Looms, Varanasi',
    price: 14490,
    compareAtPrice: 18990,
    description: 'Woven on traditional pit looms in Varanasi with fine katan silk warps and antique gold Roopa-Sona brocade. Adorned with delicate floral jaal work inspired by Mughal court textiles. Certified Handloom Mark product.',
    collections: ['sarees', 'silk-sarees', 'wedding-edit', 'bestsellers'],
    tags: ['saree', 'banarasi', 'katan-silk', 'wedding', 'brocade', 'festive'],
    material: 'Pure Katan Silk with Roopa-Sona Brocade',
    options: [
      { name: 'Color', values: ['Midnight Blue', 'Magenta Pink', 'Antique Gold'] },
    ],
    variants: [
      {
        title: 'Midnight Blue',
        sku: 'AUR-BAN-BLU',
        barcode: '890100200101',
        price: 14490,
        compareAtPrice: 18990,
        stock: 12,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Midnight Blue' }],
      },
      {
        title: 'Magenta Pink',
        sku: 'AUR-BAN-PNK',
        barcode: '890100200102',
        price: 14490,
        compareAtPrice: 18990,
        stock: 9,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Magenta Pink' }],
      },
      {
        title: 'Antique Gold',
        sku: 'AUR-BAN-GLD',
        barcode: '890100200103',
        price: 15490,
        compareAtPrice: 19990,
        stock: 7,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Antique Gold' }],
      },
    ],
    images: [
      { id: 'img-ban-1', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop', altText: 'Banarasi Zari Brocade Katan Silk Drape', width: 1200, height: 1500 },
      { id: 'img-ban-2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Banarasi Kadwa Floral Weave Detail', width: 1200, height: 1500 },
      { id: 'img-ban-3', url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&auto=format&fit=crop', altText: 'Banarasi Silk Border Selvedge', width: 1200, height: 1500 },
    ],
  },

  // 3. Chanderi Tissue Organza Saree
  {
    handle: 'chanderi-tissue-organza-saree',
    title: 'Chanderi Hand-Printed Tissue Organza Saree',
    productType: 'Sarees',
    vendor: 'Chanderi Weavers Co-Op, MP',
    price: 7490,
    compareAtPrice: 9490,
    description: 'Ethereal sheer tissue organza saree woven with spun silk and fine cotton threads. Decorated with hand-block printed botanical motifs and finished with a delicate scalloped zari lace selvedge. Lightweight summer luxury.',
    collections: ['sarees', 'new-arrivals', 'everyday-silks'],
    tags: ['saree', 'chanderi', 'organza', 'summer', 'floral', 'hand-printed'],
    material: 'Tissue Silk Organza & Cotton Blend',
    options: [
      { name: 'Color', values: ['Rose Gold Tint', 'Mint Sage', 'Ivory Pearl'] },
    ],
    variants: [
      {
        title: 'Rose Gold Tint',
        sku: 'AUR-CHN-RSG',
        barcode: '890100300101',
        price: 7490,
        compareAtPrice: 9490,
        stock: 15,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Rose Gold Tint' }],
      },
      {
        title: 'Mint Sage',
        sku: 'AUR-CHN-MNT',
        barcode: '890100300102',
        price: 7490,
        compareAtPrice: 9490,
        stock: 8,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Mint Sage' }],
      },
      {
        title: 'Ivory Pearl',
        sku: 'AUR-CHN-IVR',
        barcode: '890100300103',
        price: 7990,
        compareAtPrice: 9990,
        stock: 10,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Ivory Pearl' }],
      },
    ],
    images: [
      { id: 'img-chn-1', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop', altText: 'Chanderi Tissue Organza Saree Drape', width: 1200, height: 1500 },
      { id: 'img-chn-2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Chanderi Hand-Block Print Details', width: 1200, height: 1500 },
    ],
  },

  // 4. Handloom Pure Linen Saree with Zari Border
  {
    handle: 'handloom-pure-linen-zari-saree',
    title: 'Handloom Pure Linen Saree with Silver Zari Border',
    productType: 'Sarees',
    vendor: 'AURA Everyday Artisan Guild',
    price: 3990,
    compareAtPrice: 5490,
    description: '100-count organic Belgian-flax linen handloom drape with subtle matte silver zari selvedge. Incredibly breathable and softens with every wash. Designed for effortless modern workwear and casual gatherings.',
    collections: ['sarees', 'everyday-silks', 'bestsellers'],
    tags: ['saree', 'linen', 'everyday', 'workwear', 'handloom', 'silver-zari'],
    material: '100-Count Pure Organic Flax Linen',
    options: [
      { name: 'Color', values: ['Silver Mist Grey', 'Ochre Mustard', 'Slate Indigo'] },
    ],
    variants: [
      {
        title: 'Silver Mist Grey',
        sku: 'AUR-LIN-GRY',
        barcode: '890100400101',
        price: 3990,
        compareAtPrice: 5490,
        stock: 20,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Silver Mist Grey' }],
      },
      {
        title: 'Ochre Mustard',
        sku: 'AUR-LIN-MUS',
        barcode: '890100400102',
        price: 3990,
        compareAtPrice: 5490,
        stock: 14,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Ochre Mustard' }],
      },
      {
        title: 'Slate Indigo',
        sku: 'AUR-LIN-IND',
        barcode: '890100400103',
        price: 3990,
        compareAtPrice: 5490,
        stock: 11,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Slate Indigo' }],
      },
    ],
    images: [
      { id: 'img-lin-1', url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&auto=format&fit=crop', altText: 'Handloom Pure Linen Saree Drape', width: 1200, height: 1500 },
      { id: 'img-lin-2', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop', altText: 'Linen Weave Texture & Zari Selvedge', width: 1200, height: 1500 },
    ],
  },

  // 5. Paithani Pure Silk Peacock Pallu Saree (INTENTIONALLY LOW STOCK)
  {
    handle: 'paithani-pure-silk-peacock-pallu',
    title: 'Yeola Paithani Pure Silk Saree with Asawali Border',
    productType: 'Sarees',
    vendor: 'Yeola Handloom Artisans, Maharashtra',
    price: 24990,
    compareAtPrice: 29990,
    description: 'Authentic Maharashtrian heirloom Paithani hand-woven with pure natural silk and pure gold thread. The kaleidoscope pallu features hand-embroidered peacocks (Mor) and Asawali vine motifs. Highly coveted bridal treasure.',
    collections: ['sarees', 'silk-sarees', 'wedding-edit'],
    tags: ['saree', 'paithani', 'silk', 'bridal', 'yeola', 'limited-edition'],
    material: 'Pure Mulberry Silk with Muga Zari',
    options: [
      { name: 'Color', values: ['Emerald Green', 'Royal Purple'] },
    ],
    variants: [
      {
        title: 'Emerald Green',
        sku: 'AUR-PAI-GRN',
        barcode: '890100500101',
        price: 24990,
        compareAtPrice: 29990,
        stock: 2, // LOW STOCK TRIGGER (threshold 5)
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Emerald Green' }],
      },
      {
        title: 'Royal Purple',
        sku: 'AUR-PAI-PUR',
        barcode: '890100500102',
        price: 24990,
        compareAtPrice: 29990,
        stock: 1, // LOW STOCK TRIGGER (threshold 5)
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Royal Purple' }],
      },
    ],
    images: [
      { id: 'img-pai-1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Yeola Paithani Pure Silk Saree Drape', width: 1200, height: 1500 },
      { id: 'img-pai-2', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop', altText: 'Paithani Peacock Pallu Close-up', width: 1200, height: 1500 },
    ],
  },

  // 6. Tussar Georgette Sequin Drape Saree
  {
    handle: 'tussar-georgette-sequin-drape',
    title: 'Tussar Georgette Hand-Embroidered Sequin Saree',
    productType: 'Sarees',
    vendor: 'AURA Atelier Haute Couture',
    price: 8990,
    compareAtPrice: 12500,
    description: 'Fluid lightweight georgette blended with wild Tussar silk. Hand-embellished with tonal micro-sequins and cut-dana work that catches the light gracefully. Includes coordinated silk blend blouse piece.',
    collections: ['sarees', 'new-arrivals', 'wedding-edit'],
    tags: ['saree', 'georgette', 'sequins', 'partywear', 'cocktail', 'modern'],
    material: 'Tussar Georgette Blend with Micro-Sequins',
    options: [
      { name: 'Color', values: ['Champagne Gold', 'Dusty Rose', 'Smoky Mauve'] },
    ],
    variants: [
      {
        title: 'Champagne Gold',
        sku: 'AUR-TSG-GLD',
        barcode: '890100600101',
        price: 8990,
        compareAtPrice: 12500,
        stock: 16,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Champagne Gold' }],
      },
      {
        title: 'Dusty Rose',
        sku: 'AUR-TSG-ROS',
        barcode: '890100600102',
        price: 8990,
        compareAtPrice: 12500,
        stock: 12,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Dusty Rose' }],
      },
      {
        title: 'Smoky Mauve',
        sku: 'AUR-TSG-MAV',
        barcode: '890100600103',
        price: 8990,
        compareAtPrice: 12500,
        stock: 8,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Smoky Mauve' }],
      },
    ],
    images: [
      { id: 'img-tsg-1', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop', altText: 'Tussar Georgette Drape Saree', width: 1200, height: 1500 },
      { id: 'img-tsg-2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Sequin Embroidery Texture', width: 1200, height: 1500 },
    ],
  },

  // 7. Patola Double Ikat Silk Saree (INTENTIONALLY LOW STOCK)
  {
    handle: 'patola-ikat-double-weave-saree',
    title: 'Patan Patola Pure Silk Double Ikat Heritage Saree',
    productType: 'Sarees',
    vendor: 'Salvi Patola Guild, Gujarat',
    price: 32000,
    compareAtPrice: 38000,
    description: 'Masterpiece double ikat weave where both warp and weft threads are resist-dyed before weaving. Features the iconic Nari Kunjar (Elephant & Dancer) motifs in herbal natural madder and indigo dyes.',
    collections: ['sarees', 'silk-sarees', 'wedding-edit'],
    tags: ['saree', 'patola', 'ikat', 'heritage', 'handwoven', 'rare'],
    material: '100% Pure Mulberry Double Ikat Silk',
    options: [
      { name: 'Color', values: ['Ruby Red & Mustard', 'Indigo Rust'] },
    ],
    variants: [
      {
        title: 'Ruby Red & Mustard',
        sku: 'AUR-PAT-RED',
        barcode: '890100700101',
        price: 32000,
        compareAtPrice: 38000,
        stock: 1, // LOW STOCK TRIGGER (threshold 5)
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Ruby Red & Mustard' }],
      },
      {
        title: 'Indigo Rust',
        sku: 'AUR-PAT-IND',
        barcode: '890100700102',
        price: 32000,
        compareAtPrice: 38000,
        stock: 2, // LOW STOCK TRIGGER (threshold 5)
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Indigo Rust' }],
      },
    ],
    images: [
      { id: 'img-pat-1', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop', altText: 'Patan Patola Silk Saree', width: 1200, height: 1500 },
      { id: 'img-pat-2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Patola Geometric Ikat Weave Pattern', width: 1200, height: 1500 },
    ],
  },

  // 8. Bandhani Pure Georgette Gharchola
  {
    handle: 'bandhani-pure-georgette-gharchola',
    title: 'Kutch Hand-Tied Bandhani Georgette Gharchola Saree',
    productType: 'Sarees',
    vendor: 'Khatri Artisan Collective, Bhuj',
    price: 11990,
    compareAtPrice: 14990,
    description: 'Traditional Gujarati bridal Gharchola featuring 52 hand-tied chowk (grid) compartments in golden zari, adorned with Rai-dana micro tie-dye dots hand-knotted by women master artisans in Kutch.',
    collections: ['sarees', 'wedding-edit', 'new-arrivals'],
    tags: ['saree', 'bandhani', 'gharchola', 'bridal', 'tie-dye', 'kutch'],
    material: 'Pure Georgette with Zari Grid & Bandhej',
    options: [
      { name: 'Color', values: ['Vermilion Red & Gold', 'Rani Pink'] },
    ],
    variants: [
      {
        title: 'Vermilion Red & Gold',
        sku: 'AUR-BND-RED',
        barcode: '890100800101',
        price: 11990,
        compareAtPrice: 14990,
        stock: 9,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Vermilion Red & Gold' }],
      },
      {
        title: 'Rani Pink',
        sku: 'AUR-BND-PNK',
        barcode: '890100800102',
        price: 11990,
        compareAtPrice: 14990,
        stock: 7,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Rani Pink' }],
      },
    ],
    images: [
      { id: 'img-bnd-1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Kutch Bandhani Georgette Saree', width: 1200, height: 1500 },
      { id: 'img-bnd-2', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop', altText: 'Bandhej Knot Detail and Gold Grid', width: 1200, height: 1500 },
    ],
  },

  // 9. Kota Doria Pure Silk Tissue Saree (INTENTIONALLY OUT OF STOCK)
  {
    handle: 'kota-doria-pure-silk-tissue-saree',
    title: 'Kota Doria Pure Silk Khat Weave Tissue Saree',
    productType: 'Sarees',
    vendor: 'Kota Handloom Guild, Rajasthan',
    price: 5990,
    compareAtPrice: 7990,
    description: 'Light-as-air gossamer weave produced on traditional pit looms in Kaithoon. The characteristic checkered Khat weave is embellished with real silver foil accents. Perfect drape for warm summer ceremonies.',
    collections: ['sarees', 'everyday-silks'],
    tags: ['saree', 'kota-doria', 'tissue', 'summer', 'rajasthan'],
    material: 'Pure Mulberry Silk & Cotton Khat Weave',
    options: [
      { name: 'Color', values: ['Powder Blue', 'Soft Lavender'] },
    ],
    variants: [
      {
        title: 'Powder Blue',
        sku: 'AUR-KOT-BLU',
        barcode: '890100900101',
        price: 5990,
        compareAtPrice: 7990,
        stock: 0, // OUT OF STOCK TRIGGER
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Powder Blue' }],
      },
      {
        title: 'Soft Lavender',
        sku: 'AUR-KOT-LAV',
        barcode: '890100900102',
        price: 5990,
        compareAtPrice: 7990,
        stock: 0, // OUT OF STOCK TRIGGER
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Soft Lavender' }],
      },
    ],
    images: [
      { id: 'img-kot-1', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop', altText: 'Kota Doria Silk Saree Drape', width: 1200, height: 1500 },
      { id: 'img-kot-2', url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&auto=format&fit=crop', altText: 'Kota Doria Checkered Weave', width: 1200, height: 1500 },
    ],
  },

  // 10. Baluchari Swarnachari Saree
  {
    handle: 'baluchari-swarnachari-mythological-saree',
    title: 'Bishnupur Swarnachari Pure Silk Saree',
    productType: 'Sarees',
    vendor: 'Bishnupur Weavers Guild, West Bengal',
    price: 18990,
    compareAtPrice: 24990,
    description: 'Handwoven in Bishnupur using pure mulberry silk warps and gleaming gold zari weft. Illustrates classical Ramayana and Mahabharata narrative scenes across the extensive 1.2-meter bridal anchal pallu.',
    collections: ['sarees', 'silk-sarees', 'wedding-edit'],
    tags: ['saree', 'baluchari', 'swarnachari', 'bengal', 'mythological', 'heritage'],
    material: 'Pure Murshidabad Mulberry Silk & Gold Brocade',
    options: [
      { name: 'Color', values: ['Deep Maroon', 'Royal Ochre'] },
    ],
    variants: [
      {
        title: 'Deep Maroon',
        sku: 'AUR-BAL-MRN',
        barcode: '890101000101',
        price: 18990,
        compareAtPrice: 24990,
        stock: 6,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Deep Maroon' }],
      },
      {
        title: 'Royal Ochre',
        sku: 'AUR-BAL-OCH',
        barcode: '890101000102',
        price: 18990,
        compareAtPrice: 24990,
        stock: 5,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Royal Ochre' }],
      },
    ],
    images: [
      { id: 'img-bal-1', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop', altText: 'Swarnachari Pure Silk Saree', width: 1200, height: 1500 },
      { id: 'img-bal-2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Baluchari Narrative Pallu Jacquard Weave', width: 1200, height: 1500 },
    ],
  },

  // 11. Bridal Velvet Zardozi Lehenga Set
  {
    handle: 'bridal-velvet-zardozi-lehenga-set',
    title: 'Maharani Handcrafted Zardozi Bridal Velvet Lehenga Set',
    productType: 'Lehengas',
    vendor: 'AURA Atelier Bridal Studio',
    price: 34990,
    compareAtPrice: 42000,
    description: 'Opulent micro-velvet kalidar lehenga skirt with 16 panels, heavily embellished in genuine zardozi, French wire dabka, and pearl embroidery. Paired with a sweetheart neckline velvet blouse and dual sheer organza dupattas.',
    collections: ['lehengas', 'wedding-edit', 'bestsellers'],
    tags: ['lehenga', 'bridal', 'velvet', 'zardozi', 'wedding', 'couture'],
    material: 'Micro Velvet, Pure Silk Lining, Sheer Organza',
    options: [
      { name: 'Size', values: ['S (Bust 34)', 'M (Bust 36)', 'L (Bust 38)'] },
    ],
    variants: [
      {
        title: 'S (Bust 34)',
        sku: 'AUR-LHG-VEL-S',
        barcode: '890101100101',
        price: 34990,
        compareAtPrice: 42000,
        stock: 5,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Size', value: 'S (Bust 34)' }],
      },
      {
        title: 'M (Bust 36)',
        sku: 'AUR-LHG-VEL-M',
        barcode: '890101100102',
        price: 34990,
        compareAtPrice: 42000,
        stock: 8,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Size', value: 'M (Bust 36)' }],
      },
      {
        title: 'L (Bust 38)',
        sku: 'AUR-LHG-VEL-L',
        barcode: '890101100103',
        price: 34990,
        compareAtPrice: 42000,
        stock: 4,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Size', value: 'L (Bust 38)' }],
      },
    ],
    images: [
      { id: 'img-lhg-1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop', altText: 'Bridal Velvet Zardozi Lehenga Set', width: 1200, height: 1500 },
      { id: 'img-lhg-2', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', altText: 'Zardozi Embroidery & Pearl Handwork Details', width: 1200, height: 1500 },
    ],
  },

  // 12. Raw Silk Gota Patti Festive Lehenga
  {
    handle: 'raw-silk-foil-printed-festive-lehenga',
    title: 'Chanderi Raw Silk Gota Patti Festive Lehenga',
    productType: 'Lehengas',
    vendor: 'AURA Atelier Bridal Studio',
    price: 21990,
    compareAtPrice: 26990,
    description: 'Emerald green raw silk lehenga embellished with traditional Rajasthani Gota Patti ribbon work and mirror embroidery. Features a flared 6-meter ghera and unstitched raw silk blouse piece with gold net dupatta.',
    collections: ['lehengas', 'wedding-edit', 'new-arrivals'],
    tags: ['lehenga', 'festive', 'gota-patti', 'raw-silk', 'sangeet', 'mehendi'],
    material: 'Pure Raw Silk with Gota Patti & Net Dupatta',
    options: [
      { name: 'Size', values: ['S (Bust 34)', 'M (Bust 36)', 'L (Bust 38)'] },
    ],
    variants: [
      {
        title: 'S (Bust 34)',
        sku: 'AUR-LHG-RAW-S',
        barcode: '890101200101',
        price: 21990,
        compareAtPrice: 26990,
        stock: 7,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Size', value: 'S (Bust 34)' }],
      },
      {
        title: 'M (Bust 36)',
        sku: 'AUR-LHG-RAW-M',
        barcode: '890101200102',
        price: 21990,
        compareAtPrice: 26990,
        stock: 9,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Size', value: 'M (Bust 36)' }],
      },
      {
        title: 'L (Bust 38)',
        sku: 'AUR-LHG-RAW-L',
        barcode: '890101200103',
        price: 21990,
        compareAtPrice: 26990,
        stock: 6,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Size', value: 'L (Bust 38)' }],
      },
    ],
    images: [
      { id: 'img-lhg-raw-1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop', altText: 'Raw Silk Gota Patti Lehenga', width: 1200, height: 1500 },
      { id: 'img-lhg-raw-2', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop', altText: 'Gota Patti Embroidery Handcraft', width: 1200, height: 1500 },
    ],
  },

  // 13. Organza Crystal Anarkali Set (INTENTIONALLY LOW STOCK)
  {
    handle: 'organza-mirrorwork-anarkali-set',
    title: 'Lavender Crystal Mirrorwork Organza Anarkali Set',
    productType: 'Lehengas',
    vendor: 'AURA Atelier Couture',
    price: 15990,
    compareAtPrice: 19990,
    description: 'Floor-length floor sweeping flared Anarkali kurta crafted in sheer lavender organza, embellished with hand-cut mirrorwork and Swarovski crystals. Paired with silk churidar pants and a scalloped dupatta.',
    collections: ['lehengas', 'new-arrivals'],
    tags: ['anarkali', 'organza', 'crystal', 'mirrorwork', 'reception'],
    material: 'Pure Silk Organza, Shantoon Lining',
    options: [
      { name: 'Size', values: ['S (Bust 34)', 'M (Bust 36)', 'L (Bust 38)'] },
    ],
    variants: [
      {
        title: 'S (Bust 34)',
        sku: 'AUR-ANK-LAV-S',
        barcode: '890101300101',
        price: 15990,
        compareAtPrice: 19990,
        stock: 2, // LOW STOCK TRIGGER
        lowStockThreshold: 4,
        selectedOptions: [{ name: 'Size', value: 'S (Bust 34)' }],
      },
      {
        title: 'M (Bust 36)',
        sku: 'AUR-ANK-LAV-M',
        barcode: '890101300102',
        price: 15990,
        compareAtPrice: 19990,
        stock: 2, // LOW STOCK TRIGGER
        lowStockThreshold: 4,
        selectedOptions: [{ name: 'Size', value: 'M (Bust 36)' }],
      },
      {
        title: 'L (Bust 38)',
        sku: 'AUR-ANK-LAV-L',
        barcode: '890101300103',
        price: 15990,
        compareAtPrice: 19990,
        stock: 1, // LOW STOCK TRIGGER
        lowStockThreshold: 4,
        selectedOptions: [{ name: 'Size', value: 'L (Bust 38)' }],
      },
    ],
    images: [
      { id: 'img-ank-1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop', altText: 'Lavender Crystal Mirrorwork Anarkali', width: 1200, height: 1500 },
    ],
  },

  // 14. Banarasi Brocade Padded Designer Blouse
  {
    handle: 'banarasi-brocade-padded-designer-blouse',
    title: 'Banarasi Brocade Sweetheart Neck Designer Blouse',
    productType: 'Blouses',
    vendor: 'AURA Atelier Tailoring',
    price: 3490,
    compareAtPrice: 4490,
    description: 'Ready-to-wear tailored blouse fashioned from pure Banarasi gold brocade. Tailored with princess-cut panelling, built-in soft padding, back hook closure with handcrafted latkan dori, and 2-inch margin for alterations.',
    collections: ['blouses', 'wedding-edit', 'bestsellers'],
    tags: ['blouse', 'banarasi', 'brocade', 'designer-blouse', 'readymade', 'sweetheart'],
    material: 'Pure Banarasi Katan Silk Brocade & Cotton Lining',
    options: [
      { name: 'Bust Size', values: ['34', '36', '38', '40'] },
    ],
    variants: [
      {
        title: '34',
        sku: 'AUR-BLS-BAN-34',
        barcode: '890101400101',
        price: 3490,
        compareAtPrice: 4490,
        stock: 15,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '34' }],
      },
      {
        title: '36',
        sku: 'AUR-BLS-BAN-36',
        barcode: '890101400102',
        price: 3490,
        compareAtPrice: 4490,
        stock: 20,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '36' }],
      },
      {
        title: '38',
        sku: 'AUR-BLS-BAN-38',
        barcode: '890101400103',
        price: 3490,
        compareAtPrice: 4490,
        stock: 18,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '38' }],
      },
      {
        title: '40',
        sku: 'AUR-BLS-BAN-40',
        barcode: '890101400104',
        price: 3490,
        compareAtPrice: 4490,
        stock: 10,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '40' }],
      },
    ],
    images: [
      { id: 'img-bls-1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop', altText: 'Banarasi Brocade Sweetheart Blouse', width: 1200, height: 1500 },
      { id: 'img-bls-2', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop', altText: 'Brocade Fabric and Back Dori Detail', width: 1200, height: 1500 },
    ],
  },

  // 15. Raw Silk Zari Embroidered Blouse
  {
    handle: 'raw-silk-zari-embroidered-blouse',
    title: 'Crimson Raw Silk Maggam Zari Embroidered Blouse',
    productType: 'Blouses',
    vendor: 'AURA Atelier Tailoring',
    price: 2990,
    compareAtPrice: 3990,
    description: 'Padded raw silk blouse adorned with delicate Maggam threadwork along the neckline and sleeves. Crafted to pair seamlessly with both Kanjeevaram and Banarasi sarees. 100% breathable pure cotton lining.',
    collections: ['blouses', 'wedding-edit'],
    tags: ['blouse', 'raw-silk', 'maggam-work', 'embroidered', 'bridal-blouse'],
    material: 'Pure Raw Silk with Maggam Zari Threadwork',
    options: [
      { name: 'Bust Size', values: ['34', '36', '38', '40'] },
    ],
    variants: [
      {
        title: '34',
        sku: 'AUR-BLS-RAW-34',
        barcode: '890101500101',
        price: 2990,
        compareAtPrice: 3990,
        stock: 12,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '34' }],
      },
      {
        title: '36',
        sku: 'AUR-BLS-RAW-36',
        barcode: '890101500102',
        price: 2990,
        compareAtPrice: 3990,
        stock: 14,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '36' }],
      },
      {
        title: '38',
        sku: 'AUR-BLS-RAW-38',
        barcode: '890101500103',
        price: 2990,
        compareAtPrice: 3990,
        stock: 10,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '38' }],
      },
      {
        title: '40',
        sku: 'AUR-BLS-RAW-40',
        barcode: '890101500104',
        price: 2990,
        compareAtPrice: 3990,
        stock: 8,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Bust Size', value: '40' }],
      },
    ],
    images: [
      { id: 'img-bls-raw-1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop', altText: 'Crimson Raw Silk Maggam Embroidered Blouse', width: 1200, height: 1500 },
    ],
  },

  // 16. Pure Satin Silk Silhouette Petticoat
  {
    handle: 'pure-satin-silk-saree-silhouette-petticoat',
    title: 'Mermaid Fit Satin Saree Silhouette Shapewear Petticoat',
    productType: 'Petticoats',
    vendor: 'AURA Essentials',
    price: 1890,
    compareAtPrice: 2490,
    description: 'Engineered mermaid-silhouette shapewear petticoat designed for flawless saree draping without bulk. Features a comfortable stretch waistband, side slit for unrestricted stride, and smooth micro-satin fabric that glides under silk sarees.',
    collections: ['bestsellers', 'everyday-silks'],
    tags: ['petticoat', 'shapewear', 'saree-silhouette', 'satin', 'essentials'],
    material: '92% Micro Satin Silk, 8% Elastane Stretch',
    options: [
      { name: 'Color', values: ['Ivory Cream', 'Deep Maroon', 'Midnight Black'] },
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
    ],
    variants: [
      {
        title: 'Ivory Cream / S',
        sku: 'AUR-PET-IVR-S',
        barcode: '890101600101',
        price: 1890,
        compareAtPrice: 2490,
        stock: 18,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Ivory Cream' }, { name: 'Size', value: 'S' }],
      },
      {
        title: 'Ivory Cream / M',
        sku: 'AUR-PET-IVR-M',
        barcode: '890101600102',
        price: 1890,
        compareAtPrice: 2490,
        stock: 25,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Ivory Cream' }, { name: 'Size', value: 'M' }],
      },
      {
        title: 'Deep Maroon / M',
        sku: 'AUR-PET-MRN-M',
        barcode: '890101600103',
        price: 1890,
        compareAtPrice: 2490,
        stock: 20,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Deep Maroon' }, { name: 'Size', value: 'M' }],
      },
      {
        title: 'Midnight Black / L',
        sku: 'AUR-PET-BLK-L',
        barcode: '890101600104',
        price: 1890,
        compareAtPrice: 2490,
        stock: 15,
        lowStockThreshold: 5,
        selectedOptions: [{ name: 'Color', value: 'Midnight Black' }, { name: 'Size', value: 'L' }],
      },
    ],
    images: [
      { id: 'img-pet-1', url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=1200&auto=format&fit=crop', altText: 'Mermaid Fit Saree Shapewear Petticoat', width: 1200, height: 1500 },
    ],
  },

  // 17. Solitaire Diamond Pendant in 18k Gold (GIA SPEC INCLUDED)
  {
    handle: 'solitaire-diamond-pendant-18k-gold',
    title: 'The Solitaire Diamond Pendant in 18k Yellow Gold',
    productType: 'Jewelry',
    vendor: 'AURA Atelier Fine Jewelry',
    price: 48000,
    compareAtPrice: 56000,
    description: 'A hand-selected 1.20-carat round brilliant diamond set in a minimalist 4-prong 18k yellow gold basket with a 45cm adjustable wheat chain. GIA Certified (Report #64821903): F Color, VVS1 Clarity, Excellent Cut, Triple Zero Polish & Symmetry. Includes physical GIA laser-inscribed certificate and luxury velvet presentation vault.',
    collections: ['jewelry', 'wedding-edit', 'bestsellers'],
    tags: ['jewelry', 'diamond', 'pendant', 'gia-certified', '18k-gold', 'solitaire'],
    material: '18k Solid Yellow Gold & 1.20ct GIA Natural Diamond',
    options: [
      { name: 'Metal', values: ['18k Yellow Gold', '18k Rose Gold', '18k White Gold'] },
    ],
    variants: [
      {
        title: '18k Yellow Gold',
        sku: 'AUR-JWL-SOL-YEL',
        barcode: '890101700101',
        price: 48000,
        compareAtPrice: 56000,
        stock: 6,
        lowStockThreshold: 2,
        selectedOptions: [{ name: 'Metal', value: '18k Yellow Gold' }],
      },
      {
        title: '18k Rose Gold',
        sku: 'AUR-JWL-SOL-ROS',
        barcode: '890101700102',
        price: 48000,
        compareAtPrice: 56000,
        stock: 4,
        lowStockThreshold: 2,
        selectedOptions: [{ name: 'Metal', value: '18k Rose Gold' }],
      },
      {
        title: '18k White Gold',
        sku: 'AUR-JWL-SOL-WHT',
        barcode: '890101700103',
        price: 48000,
        compareAtPrice: 56000,
        stock: 5,
        lowStockThreshold: 2,
        selectedOptions: [{ name: 'Metal', value: '18k White Gold' }],
      },
    ],
    images: [
      { id: 'img-jwl-1', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop', altText: 'Solitaire Diamond Pendant in 18k Yellow Gold', width: 1200, height: 1500 },
      { id: 'img-jwl-2', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop', altText: 'Diamond Prong Setting Close-up', width: 1200, height: 1500 },
    ],
  },

  // 18. Kundan Polki Uncut Diamond Heritage Choker (GIA / IGI SPEC)
  {
    handle: 'kundan-polki-uncut-diamond-choker',
    title: 'Nizam Heritage Kundan Polki 22k Gold Choker with Tourmaline Drops',
    productType: 'Jewelry',
    vendor: 'AURA Atelier Fine Jewelry',
    price: 95000,
    compareAtPrice: 110000,
    description: 'Museum-grade royal Rajasthani Kundan Jadau choker handcrafted in 22k hallmarked gold. Set with syndicate uncut Polki diamonds and Zambian emerald beads with pink tourmaline droplets. Backed with traditional Meenakari enamel artwork. Certified by IGI & GIA Gemological Laboratories.',
    collections: ['jewelry', 'wedding-edit'],
    tags: ['jewelry', 'kundan', 'polki', 'choker', '22k-gold', 'bridal-jewelry', 'heirloom'],
    material: '22k Hallmarked Gold, Uncut Polki Diamonds, Natural Emeralds',
    options: [
      { name: 'Style', values: ['Single Tier Choker', 'Layered Haar Set'] },
    ],
    variants: [
      {
        title: 'Single Tier Choker',
        sku: 'AUR-JWL-KDN-SGL',
        barcode: '890101800101',
        price: 95000,
        compareAtPrice: 110000,
        stock: 2, // LOW STOCK TRIGGER
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Style', value: 'Single Tier Choker' }],
      },
      {
        title: 'Layered Haar Set',
        sku: 'AUR-JWL-KDN-HAR',
        barcode: '890101800102',
        price: 145000,
        compareAtPrice: 165000,
        stock: 1, // LOW STOCK TRIGGER
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Style', value: 'Layered Haar Set' }],
      },
    ],
    images: [
      { id: 'img-kdn-1', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop', altText: 'Kundan Polki 22k Gold Choker', width: 1200, height: 1500 },
      { id: 'img-kdn-2', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop', altText: 'Kundan Jadau Stones and Emerald Drops', width: 1200, height: 1500 },
    ],
  },

  // 19. Temple Gold Nakshi Antique Jhumkas
  {
    handle: 'temple-gold-nakshi-jhumkas',
    title: 'Temple Nakshi Antique 22k Gold Lakshmi Jhumkas',
    productType: 'Jewelry',
    vendor: 'AURA Atelier Fine Jewelry',
    price: 36000,
    compareAtPrice: 42000,
    description: 'Hand-sculpted temple earrings crafted in 22k yellow gold with antique patina finish. Features Goddess Lakshmi seated upon a lotus dome with cascading seed pearl hangings and natural Burmese ruby cabochons. BIS Hallmarked with certificate of authenticity.',
    collections: ['jewelry', 'bestsellers', 'wedding-edit'],
    tags: ['jewelry', 'jhumka', 'temple-jewelry', '22k-gold', 'antique-gold', 'nakshi'],
    material: '22k BIS Hallmarked Yellow Gold & Natural Rubies',
    options: [
      { name: 'Finish', values: ['Antique Matte Gold', 'High Polish Gold'] },
    ],
    variants: [
      {
        title: 'Antique Matte Gold',
        sku: 'AUR-JWL-JHM-ANT',
        barcode: '890101900101',
        price: 36000,
        compareAtPrice: 42000,
        stock: 8,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Finish', value: 'Antique Matte Gold' }],
      },
      {
        title: 'High Polish Gold',
        sku: 'AUR-JWL-JHM-POL',
        barcode: '890101900102',
        price: 36000,
        compareAtPrice: 42000,
        stock: 5,
        lowStockThreshold: 3,
        selectedOptions: [{ name: 'Finish', value: 'High Polish Gold' }],
      },
    ],
    images: [
      { id: 'img-jhm-1', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&auto=format&fit=crop', altText: 'Temple Gold Nakshi Lakshmi Jhumkas', width: 1200, height: 1500 },
      { id: 'img-jhm-2', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop', altText: 'Nakshi Sculpture and Pearl Detail', width: 1200, height: 1500 },
    ],
  },

  // 20. Mulberry Silk Hand-spun Tunic
  {
    handle: 'mulberry-silk-contrast-tunic',
    title: 'Mulberry Silk Hand-Spun Relaxed Tunic',
    productType: 'Tops & Tunics',
    vendor: 'AURA Everyday Artisan Guild',
    price: 3290,
    compareAtPrice: 4490,
    description: 'Relaxed Mandarin collar ethnic tunic crafted from hand-spun mulberry silk. Breathable all-season silhouette featuring mother-of-pearl buttons and contrast piped side slits.',
    collections: ['everyday-silks', 'new-arrivals'],
    tags: ['tunic', 'top', 'mulberry-silk', 'hand-spun', 'everyday', 'contemporary'],
    material: '100% Hand-Spun Mulberry Silk',
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
    ],
    variants: [
      {
        title: 'S',
        sku: 'AUR-TOP-TNC-S',
        barcode: '890102000101',
        price: 3290,
        compareAtPrice: 4490,
        stock: 12,
        lowStockThreshold: 4,
        selectedOptions: [{ name: 'Size', value: 'S' }],
      },
      {
        title: 'M',
        sku: 'AUR-TOP-TNC-M',
        barcode: '890102000102',
        price: 3290,
        compareAtPrice: 4490,
        stock: 16,
        lowStockThreshold: 4,
        selectedOptions: [{ name: 'Size', value: 'M' }],
      },
      {
        title: 'L',
        sku: 'AUR-TOP-TNC-L',
        barcode: '890102000103',
        price: 3290,
        compareAtPrice: 4490,
        stock: 14,
        lowStockThreshold: 4,
        selectedOptions: [{ name: 'Size', value: 'L' }],
      },
      {
        title: 'XL',
        sku: 'AUR-TOP-TNC-XL',
        barcode: '890102000104',
        price: 3290,
        compareAtPrice: 4490,
        stock: 8,
        lowStockThreshold: 4,
        selectedOptions: [{ name: 'Size', value: 'XL' }],
      },
    ],
    images: [
      { id: 'img-tnc-1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop', altText: 'Mulberry Silk Relaxed Tunic', width: 1200, height: 1500 },
    ],
  },
];

const collectionsList = [
  { handle: 'sarees', title: 'Sarees Collection', description: 'Handwoven Kanjeevaram, Banarasi, Organza, Paithani, Patola & Linen Sarees.' },
  { handle: 'silk-sarees', title: 'Silk Sarees', description: 'Pure Mulberry Silk, Katan Silk & Real Gold Zari Heritage Weaves.' },
  { handle: 'bestsellers', title: 'Bestsellers', description: 'Our most cherished handloom heirlooms and iconic customer favorites.' },
  { handle: 'new-arrivals', title: 'New Arrivals', description: 'Fresh off master weaver looms — newly curated drapes and sets.' },
  { handle: 'wedding-edit', title: 'The Wedding Edit', description: 'Bridal Kanjeevarams, opulent lehengas, and handcrafted festive ensembles.' },
  { handle: 'everyday-silks', title: 'Everyday Silks & Handloom', description: 'Breathable linen sarees, lightweight organza, and artisanal silk separates.' },
  { handle: 'jewelry', title: 'Fine Heritage Jewelry', description: 'GIA-certified diamond solitaires, 22k Kundan Polki chokers, and antique temple gold.' },
  { handle: 'lehengas', title: 'Lehengas & Festive', description: 'Bridal velvet zardozi lehengas, raw silk sets, and mirrorwork Anarkalis.' },
  { handle: 'blouses', title: 'Designer Blouses', description: 'Tailored Banarasi brocade, raw silk maggam work blouses, and custom separates.' },
];

const seededOrders = [
  {
    orderNumber: 'AUR-10084',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.deshmukh@gmail.com',
    customerPhone: '+91 98200 45678',
    address: JSON.stringify({ addressLine: 'Flat 14B, Sea Face Towers, Worli', city: 'Mumbai', state: 'Maharashtra', pincode: '400018' }),
    subtotal: 51980,
    tax: 2599,
    discount: 5000,
    shipping: 0,
    total: 49579,
    status: 'Processing',
    paymentMethod: 'Prepaid (UPI / Net Banking)',
    notes: 'Please pack with festive gift wrap & handwritten congratulations card.',
    items: [
      { productHandle: 'kanjeevaram-pure-mulberry-silk-saree', variantSku: 'AUR-KNJ-RED-UNST', quantity: 2 },
      { productHandle: 'banarasi-brocade-padded-designer-blouse', variantSku: 'AUR-BLS-BAN-36', quantity: 1 },
      { productHandle: 'pure-satin-silk-saree-silhouette-petticoat', variantSku: 'AUR-PET-MRN-M', quantity: 1 },
    ],
  },
  {
    orderNumber: 'AUR-10083',
    customerName: 'Dr. Radhika Srinivasan',
    customerEmail: 'radhika.srinivasan@apollo.org',
    customerPhone: '+91 98401 23456',
    address: JSON.stringify({ addressLine: '7th Cross, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' }),
    subtotal: 48000,
    tax: 1440,
    discount: 4800,
    shipping: 0,
    total: 44640,
    status: 'Shipped',
    paymentMethod: 'Credit Card (Razorpay)',
    notes: 'Tracking ID: DTDC-BLR-99281',
    items: [
      { productHandle: 'solitaire-diamond-pendant-18k-gold', variantSku: 'AUR-JWL-SOL-YEL', quantity: 1 },
    ],
  },
  {
    orderNumber: 'AUR-10082',
    customerName: 'Kavita Singhania',
    customerEmail: 'kavita.singhania@heritage.co.in',
    customerPhone: '+91 98110 78901',
    address: JSON.stringify({ addressLine: '12 Golf Links', city: 'New Delhi', state: 'Delhi', pincode: '110003' }),
    subtotal: 129990,
    tax: 6499,
    discount: 10000,
    shipping: 0,
    total: 126489,
    status: 'Fulfilled',
    paymentMethod: 'Prepaid Wire Transfer',
    notes: 'VIP Collector order. Delivered via Blue Dart Apex.',
    items: [
      { productHandle: 'kundan-polki-uncut-diamond-choker', variantSku: 'AUR-JWL-KDN-SGL', quantity: 1 },
      { productHandle: 'bridal-velvet-zardozi-lehenga-set', variantSku: 'AUR-LHG-VEL-M', quantity: 1 },
    ],
  },
  {
    orderNumber: 'AUR-10081',
    customerName: 'Meenakshi Sundaram',
    customerEmail: 'meenakshi.s@tcs.com',
    customerPhone: '+91 98410 33445',
    address: JSON.stringify({ addressLine: '44 Boat Club Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600028' }),
    subtotal: 21980,
    tax: 1099,
    discount: 0,
    shipping: 0,
    total: 23079,
    status: 'Fulfilled',
    paymentMethod: 'Cash on Delivery (COD)',
    notes: 'Confirmed via WhatsApp concierge.',
    items: [
      { productHandle: 'banarasi-zari-brocade-katan-silk', variantSku: 'AUR-BAN-BLU', quantity: 1 },
      { productHandle: 'chanderi-tissue-organza-saree', variantSku: 'AUR-CHN-RSG', quantity: 1 },
    ],
  },
  {
    orderNumber: 'AUR-10080',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.deshmukh@gmail.com',
    customerPhone: '+91 98200 45678',
    address: JSON.stringify({ addressLine: 'Flat 14B, Sea Face Towers, Worli', city: 'Mumbai', state: 'Maharashtra', pincode: '400018' }),
    subtotal: 3990,
    tax: 199,
    discount: 500,
    shipping: 0,
    total: 3689,
    status: 'Fulfilled',
    paymentMethod: 'UPI',
    notes: 'First order from VIP Collector Ananya.',
    items: [
      { productHandle: 'handloom-pure-linen-zari-saree', variantSku: 'AUR-LIN-GRY', quantity: 1 },
    ],
  },
  {
    orderNumber: 'AUR-10079',
    customerName: 'Pooja Reddy',
    customerEmail: 'pooja.reddy@hyderabad.in',
    customerPhone: '+91 98490 88776',
    address: JSON.stringify({ addressLine: 'Plot 82, Jubilee Hills Road No 36', city: 'Hyderabad', state: 'Telangana', pincode: '500033' }),
    subtotal: 36000,
    tax: 1800,
    discount: 3600,
    shipping: 0,
    total: 34200,
    status: 'Processing',
    paymentMethod: 'Credit Card',
    notes: 'Festive order dispatch.',
    items: [
      { productHandle: 'temple-gold-nakshi-jhumkas', variantSku: 'AUR-JWL-JHM-ANT', quantity: 1 },
    ],
  },
  {
    orderNumber: 'AUR-10078',
    customerName: 'Suman Mukherjee',
    customerEmail: 'suman.m@calcutta.edu',
    customerPhone: '+91 98300 11223',
    address: JSON.stringify({ addressLine: '15 Ballygunge Circular Road', city: 'Kolkata', state: 'West Bengal', pincode: '700019' }),
    subtotal: 18990,
    tax: 949,
    discount: 0,
    shipping: 0,
    total: 19939,
    status: 'Shipped',
    paymentMethod: 'Net Banking',
    notes: 'Swarnachari Bridal Saree Dispatch.',
    items: [
      { productHandle: 'baluchari-swarnachari-mythological-saree', variantSku: 'AUR-BAL-MRN', quantity: 1 },
    ],
  },
];

const customerAccounts = [
  { name: 'Kavita Singhania', email: 'kavita.singhania@heritage.co.in', password: 'customer123' },
  { name: 'Ananya Deshmukh', email: 'ananya.deshmukh@gmail.com', password: 'customer123' },
  { name: 'Dr. Radhika Srinivasan', email: 'radhika.srinivasan@apollo.org', password: 'customer123' },
  { name: 'Meenakshi Sundaram', email: 'meenakshi.s@tcs.com', password: 'customer123' },
  { name: 'Pooja Reddy', email: 'pooja.reddy@hyderabad.in', password: 'customer123' },
  { name: 'Suman Mukherjee', email: 'suman.m@calcutta.edu', password: 'customer123' },
];

async function seedDemo() {
  console.log('🚀 Seeding comprehensive AURA demo database...');

  // 1. Admin user setup
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aura.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'AURA Founder & Creative Director' },
    create: { email: adminEmail, name: 'AURA Founder & Creative Director', passwordHash },
  });

  // 2. Customers setup
  const customerPasswordHash = await hash('customer123', 10);
  for (const c of customerAccounts) {
    await prisma.customer.upsert({
      where: { email: c.email },
      update: { name: c.name, passwordHash: customerPasswordHash },
      create: { name: c.name, email: c.email, passwordHash: customerPasswordHash },
    });
  }

  // 3. Settings configuration
  const settings = [
    { key: 'store_name', value: 'AURA', label: 'Store Name', hint: 'Shown in the storefront header and metadata' },
    { key: 'store_email', value: 'hello@aura.com', label: 'Store Email', hint: 'Used for order notifications and contact form' },
    { key: 'whatsapp_number', value: '+919876543210', label: 'WhatsApp Phone Number', hint: 'Phone number for WhatsApp concierge and product inquiry' },
    { key: 'currency', value: 'INR (₹) - India', label: 'Currency', hint: 'Currency for pricing and inventory valuation' },
    { key: 'free_shipping_threshold', value: '₹15,000', label: 'Free Shipping Above', hint: 'Complimentary shipping above this cart value' },
    { key: 'return_window', value: '14 days', label: 'Return Window', hint: 'Return period shown on the PDP and checkout' },
    { key: 'announcement_text', value: 'Complimentary Pan-India Express Shipping on Orders Above ₹15,000 · Master Weaver Authenticity Guaranteed', label: 'Top Announcement Text', hint: 'Offer banner displayed at top of storefront' },
    { key: 'announcement_marquee', value: 'true', label: 'Enable Marquee Animation', hint: 'Set to "true" for continuous scrolling marquee' },
    { key: 'announcement_enabled', value: 'true', label: 'Enable Announcement Bar', hint: 'Set to "true" to show top bar' },
    { key: 'low_stock_alerts', value: 'true', label: 'Low Stock Alerts', hint: '' },
    { key: 'new_order_alerts', value: 'true', label: 'New Order Alerts', hint: '' },
    { key: 'shop.name', value: 'AURA', label: '', hint: '' },
    { key: 'shop.description', value: 'Handcrafted Heritage Sarees, Bridal Lehengas & Fine Jewelry.', label: '', hint: '' },
    { key: 'shop.shortDescription', value: 'AURA celebrates Indian fine craft — handwoven Kanjeevarams, Banarasi brocades, and heirloom jewelry.', label: '', hint: '' },
    { key: 'shop.currencyCode', value: 'INR', label: '', hint: '' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, label: s.label, hint: s.hint },
      create: { key: s.key, value: s.value, label: s.label, hint: s.hint },
    });
  }

  // 4. Collections
  const collectionIdMap = new Map<string, number>();
  for (const col of collectionsList) {
    const row = await prisma.collection.upsert({
      where: { handle: col.handle },
      update: { title: col.title, description: col.description, descriptionHtml: `<p>${col.description}</p>` },
      create: {
        handle: col.handle,
        title: col.title,
        description: col.description,
        descriptionHtml: `<p>${col.description}</p>`,
        image: JSON.stringify({ id: `col-img-${col.handle}`, url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop', width: 1600, height: 1200 }),
        seo: JSON.stringify({ title: col.title, description: col.description }),
      },
    });
    collectionIdMap.set(col.handle, row.id);
  }

  // 5. Products & Variants
  const productIdMap = new Map<string, number>();
  const variantIdMap = new Map<string, number>();

  for (const p of products) {
    const totalInventory = p.variants.reduce((acc, v) => acc + v.stock, 0);
    const availableForSale = p.variants.some((v) => v.stock > 0);

    const productRecord = await prisma.product.upsert({
      where: { handle: p.handle },
      update: {
        title: p.title,
        description: p.description,
        descriptionHtml: `<p>${p.description}</p>`,
        vendor: p.vendor,
        productType: p.productType,
        tags: JSON.stringify(p.tags),
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currencyCode: CURRENCY,
        totalInventory,
        availableForSale,
        featuredImage: JSON.stringify(p.images[0]),
        images: JSON.stringify(p.images),
        options: JSON.stringify(p.options.map((opt, i) => ({ id: `opt-${p.handle}-${i}`, name: opt.name, values: opt.values }))),
        seo: JSON.stringify({ title: p.title, description: p.description }),
        publishedAt: new Date('2024-06-01T00:00:00Z'),
        deletedAt: null,
      },
      create: {
        handle: p.handle,
        title: p.title,
        description: p.description,
        descriptionHtml: `<p>${p.description}</p>`,
        vendor: p.vendor,
        productType: p.productType,
        tags: JSON.stringify(p.tags),
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currencyCode: CURRENCY,
        totalInventory,
        availableForSale,
        featuredImage: JSON.stringify(p.images[0]),
        images: JSON.stringify(p.images),
        options: JSON.stringify(p.options.map((opt, i) => ({ id: `opt-${p.handle}-${i}`, name: opt.name, values: opt.values }))),
        seo: JSON.stringify({ title: p.title, description: p.description }),
        publishedAt: new Date('2024-06-01T00:00:00Z'),
      },
    });

    productIdMap.set(p.handle, productRecord.id);

    // Link to collections
    for (const colHandle of p.collections) {
      const colId = collectionIdMap.get(colHandle);
      if (colId != null) {
        await prisma.collectionItem.upsert({
          where: { collectionId_productId: { collectionId: colId, productId: productRecord.id } },
          update: {},
          create: { collectionId: colId, productId: productRecord.id, position: productRecord.id },
        });
      }
    }

    // Upsert variants
    for (const v of p.variants) {
      const variantRecord = await prisma.productVariant.findFirst({
        where: { productId: productRecord.id, sku: v.sku },
      });

      const variantData = {
        title: v.title,
        sku: v.sku,
        barcode: v.barcode ?? null,
        price: v.price,
        compareAtPrice: v.compareAtPrice ?? p.compareAtPrice ?? null,
        currencyCode: CURRENCY,
        stock: v.stock,
        lowStockThreshold: v.lowStockThreshold ?? 5,
        availableForSale: v.stock > 0,
        selectedOptions: JSON.stringify(v.selectedOptions),
        deletedAt: null,
      };

      if (variantRecord) {
        const updated = await prisma.productVariant.update({
          where: { id: variantRecord.id },
          data: variantData,
        });
        variantIdMap.set(v.sku, updated.id);
      } else {
        const created = await prisma.productVariant.create({
          data: {
            ...variantData,
            productId: productRecord.id,
          },
        });
        variantIdMap.set(v.sku, created.id);

        if (v.stock > 0) {
          await prisma.inventoryMovement.create({
            data: {
              variantId: created.id,
              type: 'RESTOCK',
              quantity: v.stock,
              note: 'Initial master weaver consignment',
              reference: 'demo-seed',
            },
          });
        }
      }
    }
  }

  // 6. Orders
  for (const o of seededOrders) {
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: o.orderNumber },
    });

    if (!existingOrder) {
      const order = await prisma.order.create({
        data: {
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          address: o.address,
          subtotal: o.subtotal,
          tax: o.tax,
          discount: o.discount,
          shipping: o.shipping,
          total: o.total,
          currencyCode: CURRENCY,
          status: o.status,
          paymentMethod: o.paymentMethod,
          notes: o.notes,
        },
      });

      for (const item of o.items) {
        const prod = products.find((p) => p.handle === item.productHandle);
        const prodId = productIdMap.get(item.productHandle);
        const varId = variantIdMap.get(item.variantSku);

        if (prod && prodId && varId) {
          const variant = prod.variants.find((v) => v.sku === item.variantSku);
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: prodId,
              variantId: varId,
              title: `${prod.title} — ${variant?.title || 'Standard'}`,
              handle: prod.handle,
              price: variant?.price ?? prod.price,
              quantity: item.quantity,
              image: JSON.stringify(prod.images[0]),
            },
          });
        }
      }
    }
  }

  // 7. Product Reviews
  const firstProductId = productIdMap.get('kanjeevaram-pure-mulberry-silk-saree');
  if (firstProductId) {
    await prisma.productReview.deleteMany({ where: { productId: firstProductId } });
    await prisma.productReview.createMany({
      data: [
        {
          productId: firstProductId,
          rating: 5,
          authorName: 'Priya Venkataraman',
          authorEmail: 'priya.v@chennai.in',
          title: 'Heirloom quality — worth every rupee',
          comment: 'The Kanjeevaram arrived wrapped in tissue with a handwritten note. The pure zari work is extraordinary. Wore it for my daughter’s wedding reception.',
          status: 'APPROVED',
        },
        {
          productId: firstProductId,
          rating: 5,
          authorName: 'Meenakshi Iyer',
          authorEmail: 'meenakshi.i@bengaluru.in',
          title: 'The most beautiful drape I own',
          comment: 'Exquisite luster and rich feel. The pure mulberry silk is authentic and heavy. Compliments from all family members!',
          status: 'APPROVED',
        },
      ],
    });
  }

  // 8. Blog / Journal Articles
  const blog = await prisma.blog.upsert({
    where: { handle: 'journal' },
    update: { title: 'The AURA Journal' },
    create: { handle: 'journal', title: 'The AURA Journal' },
  });

  const articles = [
    {
      handle: 'kanjeevaram-weaving-art',
      title: 'The Sacred Art of Korvai: Inside Kanchipuram’s Master Looms',
      excerpt: 'How three-ply mulberry silk and interlocking pit-loom shuttles create the eternal Kanjeevaram temple border.',
      contentHtml: '<p>The Korvai technique is one of the most demanding handloom arts in the world. Two weavers sit across the loom, simultaneously throwing three shuttles to interlock the body warp with the contrasting border warp.</p><p>At AURA, every Kanjeevaram is woven with certified 2G silver-gilt gold zari, ensuring heirloom permanence for generations.</p>',
      author: 'AURA Curatorial Team',
      publishedAt: '2024-05-18T00:00:00Z',
    },
    {
      handle: 'saree-care-and-preservation',
      title: 'How to Store & Preserve Pure Silk Sarees for Generations',
      excerpt: 'Essential tips for wrapping in breathable unbleached muslin, refolding along crease lines, and natural pest repellents.',
      contentHtml: '<p>Pure silk is a protein fiber that breathes. Never store your heirloom sarees in plastic bags, which trap moisture and oxidize zari.</p><p>Wrap each drape in pure unbleached muslin, insert dried neem leaves or cedar blocks, and refold along new creases every six months to prevent stress wear.</p>',
      author: 'Textile Conservation Guild',
      publishedAt: '2024-04-02T00:00:00Z',
    },
  ];

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
        image: JSON.stringify({ id: `art-${a.handle}`, url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop', width: 1200, height: 800 }),
        author: a.author,
        publishedAt: new Date(a.publishedAt),
        seo: JSON.stringify({ title: a.title, description: a.excerpt }),
      },
    });
  }

  console.log('✅ AURA Demo database seed successfully completed!');
  console.log(`📊 Catalog: ${products.length} Products | ${collectionsList.length} Collections | ${seededOrders.length} Orders | ${customerAccounts.length} Customers`);
}

seedDemo()
  .catch((e) => {
    console.error('❌ Error during demo seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
