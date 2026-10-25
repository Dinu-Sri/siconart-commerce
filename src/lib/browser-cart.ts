export const CART_KEY = "siconart-cart";
export const CART_EVENT = "siconart-cart-updated";

export type CartLine = { sku: string; quantity: number };

export function readBrowserCart(): CartLine[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return normalizeCartLines(parsed);
  } catch {
    return [];
  }
}

export function writeBrowserCart(lines: CartLine[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(normalizeCartLines(lines)));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function normalizeCartLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((line) => {
      if (!line || typeof line !== "object") return null;
      const sku = "sku" in line ? String(line.sku || "") : "";
      const quantity = "quantity" in line ? Number(line.quantity) : 0;
      if (!sku || !Number.isFinite(quantity) || quantity < 1) return null;
      return { sku, quantity: Math.floor(quantity) };
    })
    .filter((line): line is CartLine => Boolean(line));
}

export function mergeCartLines(left: CartLine[], right: CartLine[]) {
  const map = new Map<string, number>();
  for (const line of [...left, ...right]) {
    map.set(line.sku, (map.get(line.sku) || 0) + line.quantity);
  }
  return Array.from(map, ([sku, quantity]) => ({ sku, quantity }));
}

export async function pullAccountCart(): Promise<CartLine[] | null> {
  const response = await fetch("/api/account/cart", { credentials: "include" });
  if (!response.ok) return null;
  const payload = (await response.json()) as { lines?: unknown };
  return normalizeCartLines(payload.lines);
}

export async function pushAccountCart(lines: CartLine[]) {
  await fetch("/api/account/cart", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines })
  }).catch(() => undefined);
}
