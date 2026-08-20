'use client';

import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Ananya R.',
    location: 'Mumbai',
    rating: 5,
    title: 'Incredible AIRism Comfort',
    comment: 'The AIRism Cotton Oversized T-Shirt has become my daily staple. Soft, breathable, and holds its shape after dozens of washes.',
    product: 'AIRism Cotton Oversized T-Shirt',
  },
  {
    id: 2,
    name: 'Priya K.',
    location: 'Bengaluru',
    rating: 5,
    title: 'Perfect Fit & Texture',
    comment: 'The Waffle Easy Pants are so comfortable for working from home and quick errands. The texture is premium and lightweight.',
    product: 'Waffle Easy Pants',
  },
  {
    id: 3,
    name: 'Meera S.',
    location: 'Delhi',
    rating: 5,
    title: 'Versatile Summer Layering',
    comment: 'Love the drape on the Linen Blend Shirt. It stays breezy in humid weather and pairs effortlessly with chinos.',
    product: 'Linen Blend Shirt',
  },
];

export function Testimonials() {
  return (
    <section className="section" aria-labelledby="testimonials-heading">
      <div className="container">
        <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-20">
          <span className="overline mb-3 inline-block">Customer Stories</span>
          <h2 id="testimonials-heading" className="font-heading text-display-sm sm:text-display-md tracking-tight text-ink mb-4">
            Worn and loved every day
          </h2>
          <div className="flex items-center justify-center gap-2 text-body-sm text-faint">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <span>4.9 / 5.0 from over 1,200 verified reviews</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 lg:gap-x-12">
          {reviews.map((review) => (
            <article key={review.id} className="border-t border-ink/10 pt-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <h3 className="font-heading text-heading-md font-medium text-ink mb-3 italic">
                  &ldquo;{review.title}&rdquo;
                </h3>
                <p className="text-body-sm text-faint leading-relaxed">
                  {review.comment}
                </p>
              </div>
              <div className="pt-4 border-t border-ink/10">
                <p className="text-body-sm font-medium text-ink">{review.name}, {review.location}</p>
                <p className="text-caption text-faint mt-0.5">{review.product} · Verified Buyer</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
