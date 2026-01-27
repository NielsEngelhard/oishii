export const OFFICIAL_TAGS = [
  { key: "vegan", emoji: "🌱" },
  { key: "vegetarian", emoji: "🥬" },
  { key: "gluten_free", emoji: "🌾" },
  { key: "dairy_free", emoji: "🥛" },
  { key: "low_carb", emoji: "🥗" },
] as const;

export type OfficialTagKey = typeof OFFICIAL_TAGS[number]["key"];

export function isOfficialTag(tagKey: string): tagKey is OfficialTagKey {
  return OFFICIAL_TAGS.some(tag => tag.key === tagKey);
}

export function getOfficialTagEmoji(tagKey: string): string | undefined {
  const tag = OFFICIAL_TAGS.find(t => t.key === tagKey);
  return tag?.emoji;
}
