'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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

export function FitGuideModal({ productType, isOpen, onClose }: FitGuideModalProps) {
  if (!isOpen) return null;

  const isSaree = productType?.toLowerCase().includes('saree');

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size & Fit Guide"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="font-sans text-heading-sm font-bold text-neutral-950">
            Size & Fit Guide
          </h2>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {isSaree ? (
            <>
              {/* Saree Measurements */}
              <div>
                <h3 className="font-sans text-body-sm font-bold text-neutral-950 mb-3">
                  Saree Dimensions
                </h3>
                <div className="space-y-2">
                  {SAREE_MEASUREMENTS.map((m) => (
                    <div key={m.label} className="flex justify-between text-body-sm border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">{m.label}</span>
                      <span className="font-medium text-neutral-950">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Draping Tips */}
              <div>
                <h3 className="font-sans text-body-sm font-bold text-neutral-950 mb-2">
                  Draping Tips
                </h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed">
                  For a classic Nivi drape, tuck the plain end into the petticoat, wrap once around, create pleats (5-7), tuck at the waist, and drape the pallu over the left shoulder. The blouse piece is unstitched and can be tailored to your measurements.
                </p>
              </div>

              {/* Model Info */}
              <div className="bg-neutral-50 rounded-md p-4">
                <p className="text-caption text-neutral-500">
                  <strong className="text-neutral-700">Model wears:</strong> Standard drape · Height 5&apos;6&quot; · Blouse size M (36&quot;)
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Standard Size Table */}
              <div>
                <h3 className="font-sans text-body-sm font-bold text-neutral-950 mb-3">
                  Size Chart (in inches)
                </h3>
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2 font-semibold text-neutral-700">Size</th>
                      <th className="text-left py-2 font-semibold text-neutral-700">Chest</th>
                      <th className="text-left py-2 font-semibold text-neutral-700">Length</th>
                      <th className="text-left py-2 font-semibold text-neutral-700">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOPS_MEASUREMENTS.map((row) => (
                      <tr key={row.size} className="border-b border-neutral-100">
                        <td className="py-2 font-medium text-neutral-950">{row.size}</td>
                        <td className="py-2 text-neutral-600">{row.chest}</td>
                        <td className="py-2 text-neutral-600">{row.length}</td>
                        <td className="py-2 text-neutral-600">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fit Note */}
              <div className="bg-neutral-50 rounded-md p-4">
                <p className="text-caption text-neutral-500">
                  <strong className="text-neutral-700">Fit:</strong> Relaxed, slightly dropped shoulder. Take your true size for an easy silhouette or size down for a tailored look.
                </p>
                <p className="text-caption text-neutral-500 mt-1">
                  <strong className="text-neutral-700">Model wears:</strong> Size M · Height 5&apos;7&quot;
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
