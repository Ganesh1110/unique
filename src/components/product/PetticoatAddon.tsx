'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { getLocalFeatureFlags } from '@/lib/feature-flags';

export interface PetticoatAddonProps {
  onToggle?: (selected: boolean, fabric: string, price: number) => void;
}

export function PetticoatAddon({ onToggle }: PetticoatAddonProps) {
  const [enabled, setEnabled] = useState(true);
  const [selected, setSelected] = useState(false);
  const [fabric, setFabric] = useState('Pure Cotton');

  useEffect(() => {
    const flags = getLocalFeatureFlags();
    setEnabled(flags.matchingPetticoatAddon);

    const handleFlagUpdate = () => {
      const updated = getLocalFeatureFlags();
      setEnabled(updated.matchingPetticoatAddon);
    };
    window.addEventListener('aura_feature_flags_updated', handleFlagUpdate);
    return () => window.removeEventListener('aura_feature_flags_updated', handleFlagUpdate);
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelected(checked);
    if (onToggle) onToggle(checked, fabric, 490);
  };

  if (!enabled) return null;

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${selected ? 'bg-amber-50/60 border-amber-300' : 'bg-neutral-50 border-neutral-200'}`}>
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleCheckboxChange}
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#E60012] focus:ring-[#E60012]/30"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-bold text-neutral-950 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Add Color-Matched Petticoat / Inskirt
            </span>
            <span className="text-caption font-bold text-[#E60012]">+₹490</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Dye-matched to this exact saree shade for seamless silhouette &amp; comfort.
          </p>

          {selected && (
            <div className="mt-3 flex items-center gap-3 pt-2 border-t border-amber-200/60">
              <span className="text-[11px] font-semibold text-neutral-700">Fabric Material:</span>
              <div className="flex gap-2">
                {['Pure Cotton', 'Satin Silk Blend'].map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => {
                      setFabric(mat);
                      if (onToggle) onToggle(true, mat, 490);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                      fabric === mat
                        ? 'bg-neutral-950 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
