'use client';

import { useState, useEffect } from 'react';
import { Scissors, Check, Info } from 'lucide-react';
import { getLocalFeatureFlags } from '@/lib/feature-flags';

export interface BlouseCustomizerProps {
  onSelectionChange?: (option: { type: string; priceAddon: number; details?: string }) => void;
}

export function BlouseCustomizer({ onSelectionChange }: BlouseCustomizerProps) {
  const [enabled, setEnabled] = useState(true);
  const [selectedType, setSelectedType] = useState<'unstitched' | 'standard' | 'custom'>('unstitched');
  const [bustSize, setBustSize] = useState('36');
  const [neckline, setNeckline] = useState('Deep U-Neck');

  useEffect(() => {
    const flags = getLocalFeatureFlags();
    setEnabled(flags.blouseCustomizer);

    const handleFlagUpdate = () => {
      const updated = getLocalFeatureFlags();
      setEnabled(updated.blouseCustomizer);
    };
    window.addEventListener('aura_feature_flags_updated', handleFlagUpdate);
    return () => window.removeEventListener('aura_feature_flags_updated', handleFlagUpdate);
  }, []);

  useEffect(() => {
    if (!onSelectionChange) return;
    if (selectedType === 'unstitched') {
      onSelectionChange({ type: 'Unstitched Blouse Piece Included', priceAddon: 0 });
    } else if (selectedType === 'standard') {
      onSelectionChange({ type: `Standard Tailored Blouse (Size ${bustSize})`, priceAddon: 990, details: `Bust ${bustSize}` });
    } else {
      onSelectionChange({ type: `Custom Stitched Blouse (${neckline}, Size ${bustSize})`, priceAddon: 1490, details: `${neckline}, Bust ${bustSize}` });
    }
  }, [selectedType, bustSize, neckline, onSelectionChange]);

  if (!enabled) return null;

  return (
    <div className="bg-neutral-50 rounded-xl p-4 sm:p-5 border border-neutral-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-950 font-sans font-bold text-body-sm">
          <Scissors className="h-4 w-4 text-[#E60012]" />
          <span>Blouse Stitching &amp; Customization</span>
        </div>
        <span className="text-caption font-semibold text-neutral-500 uppercase tracking-wider">Tailoring Service</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { id: 'unstitched', label: 'Unstitched Fabric', price: 'Included Free', desc: '0.8m matching blouse piece' },
          { id: 'standard', label: 'Standard Stitching', price: '+₹990', desc: 'Ready-to-wear padded blouse' },
          { id: 'custom', label: 'Custom Tailored', price: '+₹1,490', desc: 'Custom neckline & back design' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedType(item.id as any)}
            className={`p-3 text-left rounded-lg border transition-all duration-200 flex flex-col justify-between ${
              selectedType === item.id
                ? 'border-[#E60012] bg-white ring-1 ring-[#E60012]/30 shadow-sm'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-body-xs font-bold text-neutral-950">{item.label}</span>
                {selectedType === item.id && <Check className="h-3.5 w-3.5 text-[#E60012]" />}
              </div>
              <p className="text-[11px] text-neutral-500">{item.desc}</p>
            </div>
            <span className="text-caption font-bold text-[#E60012] mt-2 block">{item.price}</span>
          </button>
        ))}
      </div>

      {selectedType !== 'unstitched' && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200 text-body-xs">
          <div>
            <label className="label text-[10px]">Bust Size (Inches)</label>
            <select
              value={bustSize}
              onChange={(e) => setBustSize(e.target.value)}
              className="input text-body-xs py-1.5 min-h-[38px]"
            >
              {['32', '34', '36', '38', '40', '42', '44'].map((size) => (
                <option key={size} value={size}>{size} inches</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-[10px]">Neckline Style</label>
            <select
              value={neckline}
              onChange={(e) => setNeckline(e.target.value)}
              className="input text-body-xs py-1.5 min-h-[38px]"
            >
              <option value="Deep U-Neck">Deep U-Neck</option>
              <option value="Sweetheart Neck">Sweetheart Neck</option>
              <option value="High Boat Neck">High Boat Neck</option>
              <option value="Elbow Length Sleeves">Elbow Length Sleeves</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
