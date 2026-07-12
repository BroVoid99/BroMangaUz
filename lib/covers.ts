/**
 * Coverart hali tayyor bo'lmagan asarlar uchun deterministik gradient yaratadi.
 * Bir xil seed doim bir xil rangni beradi — shuning uchun sahifa qayta yuklanganda
 * muqova "sakramaydi".
 */
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gradientForSeed(seed: string): string {
  const h = hashSeed(seed);
  const hue1 = h % 360;
  const hue2 = (hue1 + 40 + (h % 60)) % 360;
  const sat = 35 + (h % 20); // muted, not neon — matches ink/gold palette
  const lightA = 14 + (h % 8);
  const lightB = 6 + (h % 5);
  return `linear-gradient(160deg, hsl(${hue1} ${sat}% ${lightA}%) 0%, hsl(${hue2} ${sat}% ${lightB}%) 100%)`;
}

export function initialsForTitle(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
