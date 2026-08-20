import { OptimizedImage } from '@/components/ui/Image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LookbookStripProps {
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  reverse?: boolean;
  className?: string;
}

export function LookbookStrip({
  image,
  alt,
  eyebrow,
  title,
  description,
  ctaText,
  ctaHref,
  reverse = false,
  className,
}: LookbookStripProps) {
  return (
    <div className={className}>
      <div className="grid lg:grid-cols-2 min-h-[380px] bg-sunken/60 border-y border-ink/10">
        {/* Image */}
        <div className={`relative min-h-[280px] lg:min-h-full overflow-hidden ${reverse ? 'lg:order-2' : ''}`}>
          <OptimizedImage
            src={image}
            alt={alt}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>

        {/* Editorial Copy */}
        <div className={`flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 lg:py-16 ${reverse ? 'lg:order-1' : ''}`}>
          {eyebrow && (
            <span className="overline mb-3 text-faint">
              {eyebrow}
            </span>
          )}
          <h3 className="font-heading text-display-sm sm:text-display-md font-medium tracking-tight text-ink mb-3">
            {title}
          </h3>
          <p className="text-body text-faint leading-relaxed max-w-md mb-6">
            {description}
          </p>
          <div>
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 text-ink font-sans font-bold text-body-sm uppercase tracking-wider hover:text-accent transition-colors"
            >
              <span>{ctaText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Pre-configured lookbook strips for saree collections */
export const SAREE_LOOKBOOKS: LookbookStripProps[] = [
  {
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&auto=format&fit=crop',
    alt: 'Banarasi silk saree editorial',
    eyebrow: 'Heritage Weaves',
    title: 'The Banarasi Edit',
    description: 'Centuries-old Mughal-era brocade techniques meet contemporary silhouettes. Each saree takes 15-45 days to weave by hand.',
    ctaText: 'Explore Banarasi',
    ctaHref: '/collections/sarees',
  },
  {
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop',
    alt: 'Organza saree editorial',
    eyebrow: 'Light & Ethereal',
    title: 'Organza Dreams',
    description: 'Sheer, weightless drapes with hand-printed floral motifs. Perfect for daytime celebrations and festive gatherings.',
    ctaText: 'Shop Organza',
    ctaHref: '/collections/sarees',
    reverse: true,
  },
];
