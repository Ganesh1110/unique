'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FitGuideModalProps {
  productType?: string;
  isOpen: boolean;
  onClose: () => void;
}

const SAREE_MEASUREMENTS = [
  { label: 'Saree Length', value: '5.5 meters (approx.)' },
  { label: 'Saree Width', value: '1.15 meters (approx.)' },
  { label: 'Blouse Piece', value: '0.8 meters (unstitched)' },
  { label: 'Pallu Length', value: '~1 meter with border' },
];

const TOPS_MEASUREMENTS = [
  { size: 'XS', chest: '32"', length: '24"', shoulder: '14"' },
  { size: 'S', chest: '34"', length: '25"', shoulder: '14.5"' },
  { size: 'M', chest: '36"', length: '26"', shoulder: '15"' },
  { size: 'L', chest: '38"', length: '27"', shoulder: '15.5"' },
  { size: 'XL', chest: '40"', length: '28"', shoulder: '16"' },
];

function StretchMeter({ label, level, note }: { label: string; level: 1 | 2 | 3; note: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-caption font-semibold text-ink">{label}</p>
        <p className="text-caption text-faint truncate">{note}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0" aria-label={`${label}: ${note}`}>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'h-2 w-5 rounded-full',
              i <= level ? 'bg-accent' : 'bg-sunken border border-ink/10'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function FitGuideModal({ productType, isOpen, onClose }: FitGuideModalProps) {
  if (!isOpen) return null;

  const isSaree = productType?.toLowerCase().includes('saree');

  return (
    <div
      className="fixed inset-0 z-overlay flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size & Fit Guide"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-surface rounded-lg shadow-strong max-w-md w-full max-h-[80vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-surface flex items-center justify-between px-6 py-4 border-b border-ink/10">
          <h2 className="font-sans text-heading-sm font-bold text-ink">
            Size & Fit Guide
          </h2>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-sunken transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-ink/70" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {isSaree ? (
            <>
              {/* Saree Measurements */}
              <div>
                <h3 className="font-sans text-body-sm font-bold text-ink mb-3">
                  Saree Dimensions
                </h3>
                <div className="space-y-2">
                  {SAREE_MEASUREMENTS.map((m) => (
                    <div key={m.label} className="flex justify-between text-body-sm border-b border-ink/10 pb-2">
                      <span className="text-faint">{m.label}</span>
                      <span className="font-medium text-ink">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Draping Tips */}
              <div>
                <h3 className="font-sans text-body-sm font-bold text-ink mb-2">
                  Draping Tips
                </h3>
                <p className="text-body-sm text-faint leading-relaxed">
                  For a classic Nivi drape, tuck the plain end into the petticoat, wrap once around, create pleats (5-7), tuck at the waist, and drape the pallu over the left shoulder. The blouse piece is unstitched and can be tailored to your measurements.
                </p>
              </div>

              {/* Model Info */}
              <div className="bg-sunken rounded-md p-4">
                <p className="text-caption text-faint">
                  <strong className="text-ink">Model wears:</strong> Standard drape · Height 5&apos;6&quot; · Blouse size M (36&quot;)
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Standard Size Table */}
              <div>
                <h3 className="font-sans text-body-sm font-bold text-ink mb-3">
                  Size Chart (in inches)
                </h3>
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-ink/15">
                      <th className="text-left py-2 font-semibold text-ink/80">Size</th>
                      <th className="text-left py-2 font-semibold text-ink/80">Chest</th>
                      <th className="text-left py-2 font-semibold text-ink/80">Length</th>
                      <th className="text-left py-2 font-semibold text-ink/80">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOPS_MEASUREMENTS.map((row) => (
                      <tr key={row.size} className="border-b border-ink/10">
                        <td className="py-2 font-medium text-ink">{row.size}</td>
                        <td className="py-2 text-faint">{row.chest}</td>
                        <td className="py-2 text-faint">{row.length}</td>
                        <td className="py-2 text-faint">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fabric stretch / give */}
              <div>
                <h3 className="font-sans text-body-sm font-bold text-ink mb-3">
                  Fabric Stretch &amp; Give
                </h3>
                <div className="space-y-3">
                  <StretchMeter label="Stretch" level={1} note="Minimal — woven cotton, no elastane" />
                  <StretchMeter label="Drape / Fall" level={2} note="Relaxed, gently follows the body" />
                  <StretchMeter label="Sleeve & hem ease" level={1} note="True to measurement" />
                </div>
              </div>

              {/* Fit Note */}
              <div className="bg-sunken rounded-md p-4 space-y-1.5">
                <p className="text-caption text-faint">
                  <strong className="text-ink">Fit:</strong> Relaxed, slightly dropped shoulder. Take your true size for an easy silhouette or size down for a tailored look.
                </p>
                <p className="text-caption text-faint">
                  <strong className="text-ink">Model wears:</strong> Size M · Height 5&apos;7&quot;
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}