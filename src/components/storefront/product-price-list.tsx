"use client";

import Image from "next/image";
import { ArrowUp, RotateCcw, Save } from "lucide-react";
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

export function ProductPriceList({ products }: { products: PriceListItem[] }) {
  const [prices, setPrices] = useState<PriceMap>(() => createDefaultPrices(products));
  const [versions, setVersions] = useState<PriceVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sortedProducts = useMemo(() => [...products].sort((a, b) => a.name.localeCompare(b.name)), [products]);

  useEffect(() => {
    const storedPrices = readJson<PriceMap>(CURRENT_KEY);
    const storedVersions = readJson<PriceVersion[]>(VERSIONS_KEY) ?? [];

    if (storedPrices) setPrices(mergeWithDefaults(products, storedPrices));
    setVersions(storedVersions);
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(prices));
  }, [prices]);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 420);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function updatePrice(sku: string, tier: PriceTier, value: string) {
    const normalized = Math.max(0, Math.round(Number(value || 0) * 100));
    setSelectedVersionId("");
    setPrices((current) => ({
      ...current,
      [sku]: {
        ...current[sku],
        [tier]: Number.isFinite(normalized) ? normalized : 0
      }
    }));
  }

  function saveVersion() {
    const nextVersion: PriceVersion = {
      id: String(Date.now()),
      name: `Version ${versions.length + 1}`,
      createdAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      prices
    };
    const nextVersions = [nextVersion, ...versions];
    setVersions(nextVersions);
    setSelectedVersionId(nextVersion.id);
    window.localStorage.setItem(VERSIONS_KEY, JSON.stringify(nextVersions));
  }

  function restoreVersion(versionId: string) {
    const version = versions.find((item) => item.id === versionId);
    if (!version) return;
    window.localStorage.setItem(LATEST_KEY, JSON.stringify(prices));
    setSelectedVersionId(version.id);
    setPrices(mergeWithDefaults(products, version.prices));
  }

  function restoreLatest() {
    const storedPrices = readJson<PriceMap>(LATEST_KEY) ?? readJson<PriceMap>(CURRENT_KEY);
    if (storedPrices) setPrices(mergeWithDefaults(products, storedPrices));
    setSelectedVersionId("");
  }

  return (
    <div
      className="min-h-dvh bg-[#fef9ef] text-[#2f2118]"
      style={{
        colorScheme: "light"
      }}
    >
      <section className="mx-auto w-full max-w-5xl px-3 py-3 sm:px-5 sm:py-5">
        <header className="sticky top-0 z-20 -mx-3 border-b border-[#ead9c3] bg-[#fef9ef]/95 px-3 py-3 backdrop-blur sm:-mx-5 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-xl font-semibold leading-tight sm:text-3xl">Sicon Art Price List</h1>
              <p className="mt-1 text-xs font-semibold text-[#8a6d56]">{sortedProducts.length} brush types</p>
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] gap-2 sm:w-[460px]">
              <select
                value={selectedVersionId}
                onChange={(event) => restoreVersion(event.target.value)}
                className="min-w-0 rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 py-2 text-xs font-semibold outline-none"
                aria-label="Price version"
              >
                <option value="">Current version</option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.name} - {version.createdAt}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={restoreLatest}
                className="inline-flex h-9 items-center justify-center rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 text-[#6d4b32]"
                aria-label="Restore latest"
                title="Restore latest"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={saveVersion}
                className="inline-flex h-9 items-center justify-center gap-1 rounded-[0.5rem] bg-[#a67146] px-3 text-xs font-semibold text-white"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </header>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <article key={product.sku} className="grid grid-cols-[96px_1fr] gap-3 rounded-[0.5rem] border border-[#ead9c3] bg-white p-2 shadow-sm sm:grid-cols-[110px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded bg-white">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="110px"
                  className="object-contain p-1.5"
                />
              </div>

              <div className="min-w-0">
                <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">{product.name}</h2>
                <div className="mt-2 grid gap-1.5">
                  <PriceInput label="Retail" value={prices[product.sku]?.retail ?? product.priceCents} onChange={(value) => updatePrice(product.sku, "retail", value)} />
                  <PriceInput label="Artist" value={prices[product.sku]?.artist ?? 0} onChange={(value) => updatePrice(product.sku, "artist", value)} />
                  <PriceInput
                    label="Wholesale"
                    value={prices[product.sku]?.wholesale ?? 0}
                    onChange={(value) => updatePrice(product.sku, "wholesale", value)}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

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

function PriceInput({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return (
    <label className="grid grid-cols-[76px_1fr] items-center gap-2 rounded bg-[#fbf4e8] px-2 py-1 text-xs">
      <span className="font-semibold text-[#8a6d56]">{label}</span>
      <span className="flex items-center rounded border border-[#ead9c3] bg-white px-2">
        <span className="text-[#8a6d56]">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={(value / 100).toFixed(2)}
          onChange={(event) => onChange(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          className="min-w-0 flex-1 bg-transparent py-1.5 pl-1 text-right font-semibold text-[#2f2118] outline-none"
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

function readJson<T>(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}
