export const normalizeSlug = (value: string = ""): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function getCategorySlug(categoryName: string): string {
  return normalizeSlug(categoryName);
}

export function matchCategory(cat1: string = "", cat2: string = ""): boolean {
  if (!cat1 || !cat2) return false;
  return normalizeSlug(cat1) === normalizeSlug(cat2);
}
