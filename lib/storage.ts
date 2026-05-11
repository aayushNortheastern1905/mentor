import type { SavedTree, Domain } from "./types";
import { DIESEL_SEED, INSPECTION_SEED } from "./seed-data";

const KEY = "mentor:trees";

function loadAll(): SavedTree[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as SavedTree[];
  } catch {
    return [];
  }
}

function saveAll(trees: SavedTree[]) {
  localStorage.setItem(KEY, JSON.stringify(trees));
}

export function getTreesByDomain(domain: Domain): SavedTree[] {
  const seeds = domain === "diesel" ? [DIESEL_SEED] : [INSPECTION_SEED];
  const saved = loadAll().filter((t) => t.domain === domain);
  return [...seeds, ...saved];
}

export function getTree(id: string): SavedTree | null {
  // Check localStorage first — user edits override seeds
  const saved = loadAll().find((t) => t.id === id);
  if (saved) return saved;
  if (id === "seed-diesel-1") return DIESEL_SEED;
  if (id === "seed-inspection-1") return INSPECTION_SEED;
  return null;
}

export function saveTree(tree: SavedTree) {
  const all = loadAll().filter((t) => t.id !== tree.id);
  saveAll([...all, tree]);
}

export function deleteTree(id: string) {
  saveAll(loadAll().filter((t) => t.id !== id));
}
