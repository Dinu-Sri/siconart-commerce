"use client";

import Image from "next/image";
import { ArrowUp, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PriceListProduct } from "@/data/price-list-products";

type ValueField = "retail" | "artist" | "wholesale" | "moq";
type ProductValues = Record<ValueField, number>;
type ValueMap = Record<string, ProductValues>;
type DraftMap = Record<string, Record<ValueField, string>>;
type PendingChange = {
  field: ValueField;
  name: string;
  next: number;
  previous: number;
  sku: string;
};
type PriceVersion = {
  id: string;
  name: string;
  createdAt: string;
  values: ValueMap;
};
type StoredPriceVersion = Omit<PriceVersion, "values"> & {
  prices?: ValueMap;
  values?: ValueMap;
};

const CURRENT_KEY = "siconart-price-list-current";
const LATEST_KEY = "siconart-price-list-latest";
const VERSIONS_KEY = "siconart-price-list-versions";
const SAVED_AT_KEY = "siconart-price-list-saved-at";

const fieldLabels: Record<ValueField, string> = {
  retail: "Retail",
  artist: "Artist",
  wholesale: "Wholesale",
  moq: "MOQ"
};

export function ProductPriceList({ products }: { products: PriceListProduct[] }) {
  const defaultValues = useMemo(() => createDefaultValues(products), [products]);
  const [values, setValues] = useState<ValueMap>(() => defaultValues);
  const [drafts, setDrafts] = useState<DraftMap>(() => createDrafts(defaultValues));
  const [versions, setVersions] = useState<PriceVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const [previewProduct, setPreviewProduct] = useState<PriceListProduct | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sortedProducts = useMemo(() => [...products].sort((a, b) => a.name.localeCompare(b.name)), [products]);

  useEffect(() => {
    const storedValues = readJson<ValueMap>(CURRENT_KEY);
    const storedVersions = normalizeVersions(products, readJson<StoredPriceVersion[]>(VERSIONS_KEY) ?? []);
    const nextValues = storedValues ? mergeWithDefaults(products, storedValues) : defaultValues;

    setValues(nextValues);
    setDrafts(createDrafts(nextValues));
    setVersions(storedVersions);
    setLastSavedAt(window.localStorage.getItem(SAVED_AT_KEY) || "");
  }, [defaultValues, products]);

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

  function persistValues(nextValues: ValueMap) {
    const savedAt = formatTimestamp(new Date());
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(nextValues));
    window.localStorage.setItem(LATEST_KEY, JSON.stringify(nextValues));
    window.localStorage.setItem(SAVED_AT_KEY, savedAt);
    setLastSavedAt(savedAt);
  }

  function updateDraft(sku: string, field: ValueField, rawValue: string) {
    const nextDraft = field === "moq" ? cleanMoqDraft(rawValue) : cleanPriceDraft(rawValue);
    setDrafts((current) => ({
      ...current,
      [sku]: {
        ...current[sku],
        [field]: nextDraft
      }
    }));
  }

  function requestCommit(product: PriceListProduct, field: ValueField) {
    const currentValue = values[product.sku]?.[field] ?? defaultValues[product.sku][field];
    const rawDraft = drafts[product.sku]?.[field] ?? formatValue(field, currentValue);
    const nextValue = field === "moq" ? parseMoq(rawDraft) : parsePriceCents(rawDraft);

    if (nextValue === currentValue) {
      resetDraft(product.sku, field, currentValue);
      return;
    }

    setPendingChange({
      field,
      name: product.name,
      next: nextValue,
      previous: currentValue,
      sku: product.sku
    });
  }

  function confirmPendingChange() {
    if (!pendingChange) return;
    setSelectedVersionId("");
    setValues((current) => {
      const nextValues = {
        ...current,
        [pendingChange.sku]: {
          ...current[pendingChange.sku],
          [pendingChange.field]: pendingChange.next
        }
      };
      persistValues(nextValues);
      return nextValues;
    });
    resetDraft(pendingChange.sku, pendingChange.field, pendingChange.next);
    setPendingChange(null);
  }

  function cancelPendingChange() {
    if (!pendingChange) return;
    resetDraft(pendingChange.sku, pendingChange.field, pendingChange.previous);
    setPendingChange(null);
  }

  function resetDraft(sku: string, field: ValueField, value: number) {
    setDrafts((current) => ({
      ...current,
      [sku]: {
        ...current[sku],
        [field]: formatValue(field, value)
      }
    }));
  }

  function saveVersion() {
    const nextVersion: PriceVersion = {
      id: String(Date.now()),
      name: `Version ${versions.length + 1}`,
      createdAt: formatTimestamp(new Date()),
      values
    };
    const nextVersions = [nextVersion, ...versions];
    setVersions(nextVersions);
    setSelectedVersionId(nextVersion.id);
    window.localStorage.setItem(VERSIONS_KEY, JSON.stringify(nextVersions));
    persistValues(values);
  }

  function restoreVersion(versionId: string) {
    const version = versions.find((item) => item.id === versionId);
    if (!version) return;
    const nextValues = mergeWithDefaults(products, version.values);
    setSelectedVersionId(version.id);
    setValues(nextValues);
    setDrafts(createDrafts(nextValues));
  }

  function restoreLatest() {
    const storedValues = readJson<ValueMap>(LATEST_KEY) ?? readJson<ValueMap>(CURRENT_KEY);
    if (!storedValues) return;
    const nextValues = mergeWithDefaults(products, storedValues);
    setValues(nextValues);
    setDrafts(createDrafts(nextValues));
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
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3"
                />
              </button>

              <div className="border-t border-[#f0e3d3] p-3">
                <h2 className="line-clamp-2 min-h-12 text-center text-lg font-semibold leading-6">{product.name}</h2>
                <div className="mt-3 grid gap-2">
                  <ValueInput
                    field="retail"
                    label="Retail"
                    value={drafts[product.sku]?.retail ?? formatValue("retail", values[product.sku]?.retail ?? product.retailCents)}
                    onChange={(value) => updateDraft(product.sku, "retail", value)}
                    onCommit={() => requestCommit(product, "retail")}
                  />
                  <ValueInput
                    field="artist"
                    label="Artist"
                    value={drafts[product.sku]?.artist ?? formatValue("artist", values[product.sku]?.artist ?? product.artistCents)}
                    onChange={(value) => updateDraft(product.sku, "artist", value)}
                    onCommit={() => requestCommit(product, "artist")}
                  />
                  <ValueInput
                    field="wholesale"
                    label="Wholesale"
                    value={drafts[product.sku]?.wholesale ?? formatValue("wholesale", values[product.sku]?.wholesale ?? product.wholesaleCents)}
                    tone="yellow"
                    onChange={(value) => updateDraft(product.sku, "wholesale", value)}
                    onCommit={() => requestCommit(product, "wholesale")}
                  />
                  <ValueInput
                    field="moq"
                    label="MOQ"
                    value={drafts[product.sku]?.moq ?? formatValue("moq", values[product.sku]?.moq ?? product.moq)}
                    tone="yellow"
                    onChange={(value) => updateDraft(product.sku, "moq", value)}
                    onCommit={() => requestCommit(product, "moq")}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {pendingChange && (
        <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-[0.5rem] border border-[#ead9c3] bg-white p-4 shadow-2xl">
          <p className="text-sm font-semibold text-[#2f2118]">
            You changed {fieldLabels[pendingChange.field].toLowerCase()} for {pendingChange.name}.
          </p>
          <p className="mt-1 text-sm text-[#8a6d56]">
            {formatValueForMessage(pendingChange.field, pendingChange.previous)} to{" "}
            {formatValueForMessage(pendingChange.field, pendingChange.next)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={cancelPendingChange}
              className="h-11 rounded-[0.5rem] border border-[#ead9c3] bg-white text-base font-semibold text-[#6d4b32]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmPendingChange}
              className="h-11 rounded-[0.5rem] bg-[#a67146] text-base font-semibold text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

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
                src={previewProduct.image}
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

function ValueInput({
  field,
  label,
  onChange,
  onCommit,
  tone = "default",
  value
}: {
  field: ValueField;
  label: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  tone?: "default" | "yellow";
  value: string;
}) {
  const isMoq = field === "moq";
  return (
    <label className={`grid grid-cols-[92px_1fr] items-center gap-2 rounded px-2 py-2 ${tone === "yellow" ? "bg-[#fff4cc]" : "bg-[#fbf4e8]"}`}>
      <span className="text-sm font-semibold text-[#8a6d56]">{label}</span>
      <span className="flex min-w-0 items-center rounded border border-[#ead9c3] bg-white px-2">
        {!isMoq && <span className="text-base text-[#8a6d56]">$</span>}
        <input
          type="text"
          inputMode={isMoq ? "numeric" : "decimal"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onCommit}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className="min-w-0 flex-1 bg-transparent py-2 pl-1 text-right text-base font-semibold text-[#2f2118] outline-none"
          aria-label={`${label} ${isMoq ? "quantity" : "price"}`}
        />
      </span>
    </label>
  );
}

function createDefaultValues(products: PriceListProduct[]) {
  return products.reduce<ValueMap>((map, product) => {
    map[product.sku] = {
      retail: product.retailCents,
      artist: product.artistCents,
      wholesale: product.wholesaleCents,
      moq: product.moq
    };
    return map;
  }, {});
}

function createDrafts(values: ValueMap) {
  return Object.fromEntries(
    Object.entries(values).map(([sku, item]) => [
      sku,
      {
        retail: formatValue("retail", item.retail),
        artist: formatValue("artist", item.artist),
        wholesale: formatValue("wholesale", item.wholesale),
        moq: formatValue("moq", item.moq)
      }
    ])
  ) as DraftMap;
}

function mergeWithDefaults(products: PriceListProduct[], storedValues: ValueMap) {
  const defaults = createDefaultValues(products);
  return Object.fromEntries(
    products.map((product) => [
      product.sku,
      {
        ...defaults[product.sku],
        ...storedValues[product.sku]
      }
    ])
  ) as ValueMap;
}

function normalizeVersions(products: PriceListProduct[], versions: StoredPriceVersion[]) {
  return versions.map((version) => ({
    id: version.id,
    name: version.name,
    createdAt: version.createdAt,
    values: mergeWithDefaults(products, version.values ?? version.prices ?? {})
  }));
}

function formatValue(field: ValueField, value: number) {
  return field === "moq" ? String(value) : centsToInput(value);
}

function formatValueForMessage(field: ValueField, value: number) {
  return field === "moq" ? `${value} pcs` : `$${centsToInput(value)}`;
}

function centsToInput(cents: number) {
  return (cents / 100).toFixed(2);
}

function parsePriceCents(value: string) {
  const normalized = cleanPriceDraft(value).replace(/^\./, "0.");
  const numberValue = Number.parseFloat(normalized || "0");
  return Number.isFinite(numberValue) ? Math.max(0, Math.round(numberValue * 100)) : 0;
}

function parseMoq(value: string) {
  const parsed = Number.parseInt(cleanMoqDraft(value) || "0", 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function cleanPriceDraft(value: string) {
  const cleaned = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const [whole = "", ...fractionParts] = cleaned.split(".");
  if (fractionParts.length === 0) return whole;
  return `${whole}.${fractionParts.join("").slice(0, 2)}`;
}

function cleanMoqDraft(value: string) {
  return value.replace(/[^0-9]/g, "");
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
