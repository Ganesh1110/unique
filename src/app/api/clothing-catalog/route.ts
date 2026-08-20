import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch live apparel data from free public fashion APIs (FakeStoreAPI & DummyJSON)
    const [fakeStoreRes, dummyJsonRes] = await Promise.allSettled([
      fetch('https://fakestoreapi.com/products'),
      fetch('https://dummyjson.com/products/category/womens-dresses'),
    ]);

    let products = [];

    if (fakeStoreRes.status === 'fulfilled' && fakeStoreRes.value.ok) {
      const data = await fakeStoreRes.value.json();
      // Filter for clothing items
      const clothing = data.filter((item: { category: string }) =>
        item.category.includes('clothing')
      ).map((item: { id: number; title: string; price: number; description: string; category: string; image: string }) => ({
        id: `fakestore-${item.id}`,
        title: item.title,
        price: Math.round(item.price * 80), // Convert to INR approximate
        compareAtPrice: Math.round(item.price * 80 * 1.3),
        description: item.description,
        category: item.category,
        image: item.image,
        source: 'FakeStoreAPI',
      }));
      products.push(...clothing);
    }

    if (dummyJsonRes.status === 'fulfilled' && dummyJsonRes.value.ok) {
      const data = await dummyJsonRes.value.json();
      if (Array.isArray(data.products)) {
        const dresses = data.products.map((item: { id: number; title: string; price: number; description: string; thumbnail: string; images: string[] }) => ({
          id: `dummyjson-${item.id}`,
          title: item.title,
          price: Math.round(item.price * 80),
          compareAtPrice: Math.round(item.price * 80 * 1.25),
          description: item.description,
          category: "women's clothing",
          image: item.thumbnail || item.images[0],
          source: 'DummyJSON',
        }));
        products.push(...dresses);
      }
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
