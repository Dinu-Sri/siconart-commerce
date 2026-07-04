"use client";

import Image from "next/image";
import { ArrowUp, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

type PriceListItem = Pick<Product, "sku" | "name" | "priceCents" | "currency" | "images">;
type PriceTier = "retail" | "artist" | "wholesale";
type PriceMap = Record<string, Record<PriceTier, number>>;
type PriceVersion = {
  id: string;
  name: string;
  createdAt: string;
  prices: PriceMap;
};

const CURRENT_KEY = "siconart-price-list-current";
const LATEST_KEY = "siconart-price-list-latest";
const VERSIONS_KEY = "siconart-price-list-versions";
const SAVED_AT_KEY = "siconart-price-list-saved-at";

export function ProductPriceList({ products }: { products: PriceListItem[] }) {
  const [prices, setPrices] = useState<PriceMap>(() => createDefaultPrices(products));
  const [versions, setVersions] = useState<PriceVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [previewProduct, setPreviewProduct] = useState<PriceListItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sortedProducts = useMemo(() => [...products].sort((a, b) => a.name.localeCompare(b.name)), [products]);

  useEffect(() => {
    const storedPrices = readJson<PriceMap>(CURRENT_KEY);
    const storedVersions = readJson<PriceVersion[]>(VERSIONS_KEY) ?? [];

    if (storedPrices) setPrices(mergeWithDefaults(products, storedPrices));
    setVersions(storedVersions);
    setLastSavedAt(window.localStorage.getItem(SAVED_AT_KEY) || "");
  }, [products]);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 420);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!previewProduct) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPreviewProduct(null);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [previewProduct]);

  function persistPrices(nextPrices: PriceMap) {
    const savedAt = formatTimestamp(new Date());
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(nextPrices));
    window.localStorage.setItem(LATEST_KEY, JSON.stringify(nextPrices));
    window.localStorage.setItem(SAVED_AT_KEY, savedAt);
    setLastSavedAt(savedAt);
  }

  function updatePrice(sku: string, tier: PriceTier, value: string) {
    const normalized = parsePriceCents(value);
    setSelectedVersionId("");
    setPrices((current) => {
      const nextPrices = {
        ...current,
        [sku]: {
          ...current[sku],
          [tier]: normalized
        }
      };
      persistPrices(nextPrices);
      return nextPrices;
    });
  }

  function saveVersion() {
    const nextVersion: PriceVersion = {
      id: String(Date.now()),
      name: `Version ${versions.length + 1}`,
      createdAt: formatTimestamp(new Date()),
      prices
    };
    const nextVersions = [nextVersion, ...versions];
    setVersions(nextVersions);
    setSelectedVersionId(nextVersion.id);
    window.localStorage.setItem(VERSIONS_KEY, JSON.stringify(nextVersions));
    persistPrices(prices);
  }

  function restoreVersion(versionId: string) {
    const version = versions.find((item) => item.id === versionId);
    if (!version) return;
    setSelectedVersionId(version.id);
    setPrices(mergeWithDefaults(products, version.prices));
  }

  function restoreLatest() {
    const storedPrices = readJson<PriceMap>(LATEST_KEY) ?? readJson<PriceMap>(CURRENT_KEY);
    if (storedPrices) setPrices(mergeWithDefaults(products, storedPrices));
    setSelectedVersionId("");
  }

  return (
    <div className="min-h-dvh bg-[#fef9ef] text-[#2f2118]" style={{ colorScheme: "light" }}>
      <section className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-5 sm:py-5">
        <header className="-mx-3 border-b border-[#ead9c3] bg-[#fef9ef] px-3 py-3 sm:-mx-5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-serif text-xl font-semibold leading-tight sm:text-3xl">Sicon Art Price List</h1>
            <p className="shrink-0 text-right text-xs font-semibold text-[#8a6d56] sm:text-sm">{sortedProducts.length} brush types</p>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
            <select
              value={selectedVersionId}
              onChange={(event) => restoreVersion(event.target.value)}
              className="min-w-0 rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-2 text-base font-semibold outline-none sm:text-sm"
              aria-label="Price version"
            >
              <option value="">Current version{lastSavedAt ? ` - saved ${lastSavedAt}` : ""}</option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name} - {version.createdAt}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={restoreLatest}
              className="inline-flex h-10 items-center justify-center rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 text-[#6d4b32]"
              aria-label="Restore latest"
              title="Restore latest"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={saveVersion}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-[0.5rem] bg-[#a67146] px-3 text-sm font-semibold text-white"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </header>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <article key={product.sku} className="overflow-hidden rounded-[0.5rem] border border-[#ead9c3] bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setPreviewProduct(product)}
                className="relative block h-64 w-full bg-white sm:h-72"
                aria-label={`Open ${product.name} image`}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3"
                />
              </button>

              <div className="border-t border-[#f0e3d3] p-3">
                <h2 className="line-clamp-2 min-h-12 text-center text-lg font-semibold leading-6">{product.name}</h2>
                <div className="mt-3 grid gap-2">
                  <PriceInput label="Retail" value={prices[product.sku]?.retail ?? product.priceCents} onSave={(value) => updatePrice(product.sku, "retail", value)} />
                  <PriceInput label="Artist" value={prices[product.sku]?.artist ?? 0} onSave={(value) => updatePrice(product.sku, "artist", value)} />
                  <PriceInput label="Wholesale" value={prices[product.sku]?.wholesale ?? 0} onSave={(value) => updatePrice(product.sku, "wholesale", value)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {previewProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${previewProduct.name} image preview`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewProduct(null);
          }}
        >
          <div className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[0.5rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-[#ead9c3] px-4 py-3">
              <h2 className="line-clamp-1 text-base font-semibold text-[#2f2118] sm:text-xl">{previewProduct.name}</h2>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fbf4e8] text-[#6d4b32]"
                aria-label="Close image preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative h-[72dvh] min-h-[360px] bg-white">
              <Image
                src={previewProduct.images[0]}
                alt={previewProduct.name}
                fill
                sizes="100vw"
                priority
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-4 right-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#a67146] text-white shadow-lg transition ${
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}

function PriceInput({ label, value, onSave }: { label: string; value: number; onSave: (value: string) => void }) {
  const [draft, setDraft] = useState(centsToInput(value));

  useEffect(() => {
    setDraft(centsToInput(value));
  }, [value]);

  function commit() {
    const nextValue = centsToInput(parsePriceCents(draft));
    setDraft(nextValue);
    onSave(nextValue);
  }

  return (
    <label className="grid grid-cols-[92px_1fr] items-center gap-2 rounded bg-[#fbf4e8] px-2 py-2">
      <span className="text-sm font-semibold text-[#8a6d56]">{label}</span>
      <span className="flex min-w-0 items-center rounded border border-[#ead9c3] bg-white px-2">
        <span className="text-base text-[#8a6d56]">$</span>
        <input
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={(event) => setDraft(cleanPriceDraft(event.target.value))}
          onBlur={commit}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className="min-w-0 flex-1 bg-transparent py-2 pl-1 text-right text-base font-semibold text-[#2f2118] outline-none"
          aria-label={`${label} price`}
        />
      </span>
    </label>
  );
}

function createDefaultPrices(products: PriceListItem[]) {
  return products.reduce<PriceMap>((map, product) => {
    map[product.sku] = {
      retail: product.priceCents,
      artist: tierPrice(product.priceCents, 0.8),
      wholesale: tierPrice(product.priceCents, 0.65)
    };
    return map;
  }, {});
}

function mergeWithDefaults(products: PriceListItem[], storedPrices: PriceMap) {
  const defaults = createDefaultPrices(products);
  return Object.fromEntries(
    products.map((product) => [
      product.sku,
      {
        ...defaults[product.sku],
        ...storedPrices[product.sku]
      }
    ])
  ) as PriceMap;
}

function tierPrice(cents: number, multiplier: number) {
  return Math.round((cents * multiplier) / 100) * 100;
}

function centsToInput(cents: number) {
  return (cents / 100).toFixed(2);
}

function parsePriceCents(value: string) {
  const normalized = cleanPriceDraft(value).replace(/^\./, "0.");
  const numberValue = Number.parseFloat(normalized || "0");
  return Number.isFinite(numberValue) ? Math.max(0, Math.round(numberValue * 100)) : 0;
}

function cleanPriceDraft(value: string) {
  const cleaned = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const [whole = "", ...fractionParts] = cleaned.split(".");
  if (fractionParts.length === 0) return whole;
  return `${whole}.${fractionParts.join("").slice(0, 2)}`;
}

function formatTimestamp(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function readJson<T>(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}
