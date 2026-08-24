export interface FeatureFlags {
  guestWelcomeOffer: boolean;
  blouseCustomizer: boolean;
  matchingPetticoatAddon: boolean;
  liveSalesToasts: boolean;
  compareDrawer: boolean;
  luxuryGiftWrap: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  guestWelcomeOffer: true,
  blouseCustomizer: true,
  matchingPetticoatAddon: true,
  liveSalesToasts: true,
  compareDrawer: true,
  luxuryGiftWrap: true,
};

const FEATURE_FLAGS_KEY = 'aura_feature_flags';

export function getLocalFeatureFlags(): FeatureFlags {
  if (typeof window === 'undefined') return DEFAULT_FEATURE_FLAGS;
  try {
    const stored = localStorage.getItem(FEATURE_FLAGS_KEY);
    if (stored) {
      return { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_FEATURE_FLAGS;
}

export function saveLocalFeatureFlags(flags: Partial<FeatureFlags>): FeatureFlags {
  if (typeof window === 'undefined') return DEFAULT_FEATURE_FLAGS;
  try {
    const current = getLocalFeatureFlags();
    const updated = { ...current, ...flags };
    localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(updated));
    // Trigger custom storage event for instant UI update
    window.dispatchEvent(new Event('aura_feature_flags_updated'));
    return updated;
  } catch {}
  return DEFAULT_FEATURE_FLAGS;
}
