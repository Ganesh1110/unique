'use client';

import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya Venkataraman',
    location: 'Chennai',
    rating: 5,
    title: 'Heirloom quality — worth every rupee',
    comment: 'The Kanjeevaram Pure Mulberry Silk arrived wrapped in tissue with a handwritten note. The zari work is extraordinary — my grandmother immediately recognized it as authentic Kanchipuram craftsmanship. I wore it for my daughter\'s wedding reception and received compliments all evening.',
    product: 'Kanjeevaram Pure Silk Saree',
  },
  {
    id: 2,
    name: 'Meenakshi Iyer',
    location: 'Bengaluru',
    rating: 5,
    title: 'The most beautiful drape I own',
    comment: 'I was hesitant to buy a silk saree online, but AURA\'s detail photography convinced me. The Chanderi tissue organza is even more exquisite in person — it catches light like nothing I\'ve seen. The complimentary blouse stitching was perfectly tailored to my measurements.',
    product: 'Chanderi Tissue Organza Saree',
  },
  {
    id: 3,
    name: 'Sunita Bhatia',
    location: 'New Delhi',
    rating: 5,
    title: 'Bridal saree exceeded all expectations',
    comment: 'AURA\'s Banarasi Zari Brocade was my wedding saree. The katan silk base is incredibly luxurious and the gold zari detailing is intricate beyond description. Three months later and it still looks brand new. Heirloom quality — I will pass this to my children.',
    product: 'Banarasi Zari Brocade Katan Silk Saree',
  },
];

export function Testimonials() {
  return (
    <section
      className="py-20 sm:py-28 lg:py-32 bg-cream-100"
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        {/* Header */}
        <header className="max-w-2xl mx-auto text-center mb-16 lg:mb-24">
          <span className="section-label mb-4 inline-block">Customer Stories</span>
          <h2
            id="testimonials-heading"
            className="font-heading text-display-sm sm:text-display-md tracking-tight text-ink mb-5"
          >
            Worn and cherished
          </h2>
          <div className="flex items-center justify-center gap-3 text-body-sm text-faint">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <span>4.9 / 5.0</span>
            <span className="text-ink/20">·</span>
            <span>1,200+ verified reviews</span>
          </div>
        </header>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12 lg:gap-x-16">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="border-t border-ink/10 pt-8 flex flex-col justify-between gap-6"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>

                {/* Review title */}
                <h3 className="font-heading text-heading-md sm:text-heading-lg font-medium text-ink mb-3 italic leading-snug">
                  &ldquo;{review.title}&rdquo;
                </h3>

                {/* Review body */}
                <p className="text-body-sm text-faint leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-5 border-t border-ink/10">
                <p className="text-body-sm font-medium text-ink">
                  {review.name}
                  <span className="font-normal text-faint mx-1.5">·</span>
                  {review.location}
                </p>
                <p className="section-label mt-1">
                  {review.product} &nbsp;·&nbsp; Verified Buyer
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
