export type Difficulty = "beginner" | "adept" | "expert" | "mastery";

export function calculateNpcTotal(quantity: number, npcBuyPrice: number) {
  return quantity * npcBuyPrice;
}

export function calculateMarketTotal(quantity: number, marketPrice: number) {
  return quantity * marketPrice;
}

export function calculateTaskXp(
  level: number,
  difficulty: Difficulty,
  difficultyCaps: Record<Difficulty, number | null>,
  baseMultiplier = 1995
) {
  const safeLevel = Number.isFinite(level) && level > 0 ? level : 1;
  const baseXp = safeLevel * baseMultiplier;
  const cap = difficultyCaps[difficulty];

  if (cap === null || cap === undefined) {
    return {
      baseXp,
      finalXp: baseXp,
      capped: false,
    };
  }

  return {
    baseXp,
    finalXp: Math.min(baseXp, cap),
    capped: baseXp > cap,
  };
}

export function getRecommendation(
  npcTotal: number,
  marketTotal: number,
  finalXp: number
) {
  const goldDifference = Math.abs(marketTotal - npcTotal).toLocaleString();
  const formattedXp = finalXp.toLocaleString();

  if (marketTotal > npcTotal) {
    return `Sell on Market. You earn ${goldDifference} more gold than selling to NPC. If experience matters more for your current progress, the task reward of ${formattedXp} XP may still be worth considering.`;
  }

  if (npcTotal > marketTotal) {
    return `Sell to NPC. You earn ${goldDifference} more gold than selling on Market. If experience matters more for your current progress, the task reward of ${formattedXp} XP may still be worth considering.`;
  }

  return `Both options give the same gold value. In that case, the task reward of ${formattedXp} XP can be a strong reason to complete the delivery instead of selling the item.`;
}