"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, FileDown, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  matchesPriceListBrowse,
  priceListBrowseCategories,
  type PriceListBrowseId,
  type PriceListProduct
} from "@/data/price-list-products";
import type { PriceListOverride, PriceListValueField } from "@/lib/price-list-fields";
import {
  pingListAccess,
  savePriceListUpdates,
  unlockListAccess,
  type PriceSaveError
} from "@/lib/price-list-sync-client";

type ValueField = PriceListValueField;
type PriceCatalogKind = "market" | "artist" | "mini" | "bulk";
type ProductValues = Record<ValueField, number>;
type ValueMap = Record<string, ProductValues>;
type DraftMap = Record<string, Record<ValueField, string>>;
type LegacyProductValues = Partial<ProductValues> & {
  wholesale?: number;
  moq?: number;
};
type StoredValueMap = Record<string, LegacyProductValues>;
type PendingChange = {
  field: ValueField;
  name: string;
  next: number;
  previous: number;
  sku: string;
};
const CURRENT_KEY = "siconart-price-list-current-v2";
const LATEST_KEY = "siconart-price-list-latest-v2";
const SAVED_AT_KEY = "siconart-price-list-saved-at-v2";
const valueFields: ValueField[] = [
  "retail",
  "artist",
  "miniWholesale",
  "miniWholesaleMoq",
  "bulkWholesale",
  "bulkWholesaleMoq"
];

const fieldLabels: Record<ValueField, string> = {
  retail: "Market",
  artist: "Artist",
  miniWholesale: "Mini wholesale price",
  miniWholesaleMoq: "Mini wholesale MOQ",
  bulkWholesale: "Bulk wholesale price",
  bulkWholesaleMoq: "Bulk wholesale MOQ"
};

export function ProductPriceList({
  products,
  listOverrides = {}
}: {
  products: PriceListProduct[];
  listOverrides?: Record<string, PriceListOverride>;
}) {
  const defaultValues = useMemo(() => createDefaultValues(products, listOverrides), [listOverrides, products]);
  const [values, setValues] = useState<ValueMap>(() => defaultValues);
  const [drafts, setDrafts] = useState<DraftMap>(() => createDrafts(defaultValues));
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const [previewProduct, setPreviewProduct] = useState<PriceListProduct | null>(null);
  const [downloadingCatalog, setDownloadingCatalog] = useState<PriceCatalogKind | null>(null);
  const [catalogError, setCatalogError] = useState("");

  const [browseId, setBrowseId] = useState<PriceListBrowseId>("all");
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [saveError, setSaveError] = useState<PriceSaveError | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(true);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const priceA = values[a.sku]?.retail ?? a.retailCents;
      const priceB = values[b.sku]?.retail ?? b.retailCents;
      const rank = (cents: number) => (cents > 0 ? cents : Number.POSITIVE_INFINITY);
      const diff = rank(priceA) - rank(priceB);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });
  }, [products, values]);
  const visibleProducts = useMemo(() => {
    return sortedProducts.filter((product) =>
      matchesPriceListBrowse(product.sku, values[product.sku]?.retail ?? product.retailCents, browseId)
    );
  }, [browseId, sortedProducts, values]);

  useEffect(() => {
    setValues(defaultValues);
    setDrafts(createDrafts(defaultValues));
  }, [defaultValues, products]);

  useEffect(() => {
    let cancelled = false;
    void pingListAccess().then((ok) => {
      if (!cancelled) setSessionReady(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!saveNotice) return;
    const timer = window.setTimeout(() => setSaveNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [saveNotice]);

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

  function persistLocal(nextValues: ValueMap) {
    const stored = storedOverrides(products, nextValues);
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(stored));
    window.localStorage.setItem(LATEST_KEY, JSON.stringify(stored));
    window.localStorage.setItem(SAVED_AT_KEY, formatTimestamp(new Date()));
  }

  function applyValues(nextValues: ValueMap) {
    setValues(nextValues);
    persistLocal(nextValues);
  }

  async function syncFields(nextValues: ValueMap, targets: Array<{ sku: string; field: ValueField }>) {
    const updates = targets
      .filter((target) => target.sku)
      .map((target) => ({
        sku: target.sku,
        field: target.field,
        value: nextValues[target.sku]?.[target.field] ?? defaultValues[target.sku]?.[target.field] ?? 0
      }));
    if (updates.length === 0) return true;
    const result = await savePriceListUpdates(updates);
    if (result.ok) {
      setSessionReady(true);
      setSaveError(null);
      setCatalogError("");
      return true;
    }
    setSaveError(result.error);
    setSessionReady(!result.error.needsUnlock);
    return false;
  }

  function updateDraft(sku: string, field: ValueField, rawValue: string) {
    const nextDraft = isMoqField(field) ? cleanMoqDraft(rawValue) : cleanPriceDraft(rawValue);
    setDrafts((current) => ({
      ...current,
      [sku]: {
        ...current[sku],
        [field]: nextDraft
      }
    }));
  }

  function requestCommit(product: PriceListProduct, field: ValueField) {
    if (saving || pendingChange || saveError) return;

    const currentValue = values[product.sku]?.[field] ?? defaultValues[product.sku][field];
    const rawDraft = drafts[product.sku]?.[field] ?? formatValue(field, currentValue);
    const nextValue = isMoqField(field) ? parseMoq(rawDraft) : parsePriceCents(rawDraft);

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

  async function confirmPendingChange() {
    if (!pendingChange || saving) return;
    const change = pendingChange;
    const nextValues = {
      ...values,
      [change.sku]: {
        ...values[change.sku],
        [change.field]: change.next
      }
    };

    setSaving(true);
    setSaveError(null);
    const ok = await syncFields(nextValues, [{ sku: change.sku, field: change.field }]);
    setSaving(false);
    if (!ok) return;
    setSaveNotice(
      `Saved ${change.name} ${fieldLabels[change.field].toLowerCase()} ${formatValueForMessage(change.field, change.next)} on every device.`
    );

    applyValues(nextValues);
    resetDraft(change.sku, change.field, change.next);
    setPendingChange(null);
    setUnlockPassword("");
  }

  function cancelPendingChange() {
    if (!pendingChange || saving) return;
    resetDraft(pendingChange.sku, pendingChange.field, pendingChange.previous);
    setPendingChange(null);
    setSaveError(null);
    setUnlockPassword("");
  }

  async function retryPendingSave() {
    setUnlockPassword("");
    await confirmPendingChange();
  }

  async function unlockAndRetry() {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    const unlocked = await unlockListAccess(unlockPassword);
    if (!unlocked.ok) {
      setSaving(false);
      setSaveError(unlocked.error);
      setSessionReady(false);
      return;
    }
    setSessionReady(true);
    setSaving(false);
    if (pendingChange) {
      await confirmPendingChange();
      return;
    }
    setUnlockPassword("");
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

  async function downloadCatalog(kind: PriceCatalogKind) {
    setDownloadingCatalog(kind);
    setCatalogError("");

    try {
      const response = await fetch("/api/price-list/pdf", {
        body: JSON.stringify({ kind, values }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("PDF could not be generated.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getCatalogFilename(kind);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setCatalogError("PDF download failed. Please refresh the list and try again.");
    } finally {
      setDownloadingCatalog(null);
    }
  }

  return (
    <div className="text-[#2f2118]" style={{ colorScheme: "light" }}>
      <section className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-5 sm:py-5">
        <header className="-mx-3 border-b border-[#ead9c3] bg-[#fef9ef] px-3 pb-3 sm:-mx-5 sm:px-5">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <CatalogButton
              kind="market"
              label="Market prices"
              loading={downloadingCatalog === "market"}
              onClick={() => downloadCatalog("market")}
            />
            <CatalogButton
              kind="artist"
              label="Artist prices"
              loading={downloadingCatalog === "artist"}
              onClick={() => downloadCatalog("artist")}
            />
            <CatalogButton
              kind="mini"
              label="Mini wholesale price list"
              loading={downloadingCatalog === "mini"}
              onClick={() => downloadCatalog("mini")}
            />
            <CatalogButton
              kind="bulk"
              label="Bulk wholesale price list"
              loading={downloadingCatalog === "bulk"}
              onClick={() => downloadCatalog("bulk")}
            />
          </div>
          {catalogError && <p className="mt-2 text-sm font-semibold text-red-600">{catalogError}</p>}
        </header>

        <div
          data-list="chips"
          className="-mx-3 mt-3 bg-[#fef9ef] px-3 pb-3 sm:-mx-5 sm:px-5 xl:sticky xl:top-0 xl:z-20 xl:border-b xl:border-[#ead9c3] xl:py-3 xl:shadow-[0_10px_18px_-14px_rgba(82,58,39,0.45)]"
        >
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
              {priceListBrowseCategories.map((category) => {
                const active = browseId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setBrowseId(category.id)}
                    className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-[#a67146] bg-[#a67146] text-white"
                        : "border-[#ead9c3] bg-white text-[#6d4b32]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
            <p className="shrink-0 text-right text-xs font-semibold text-[#8a6d56] sm:text-sm">
              {browseId === "all"
                ? `${sortedProducts.length} brush types`
                : `${visibleProducts.length} of ${sortedProducts.length}`}
            </p>
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <p className="mt-8 text-center text-sm font-semibold text-[#8a6d56]">No brushes in this category yet.</p>
        ) : null}

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
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
                    label="Market"
                    value={drafts[product.sku]?.retail ?? formatValue("retail", values[product.sku]?.retail ?? product.retailCents)}
                    onChange={(value) => updateDraft(product.sku, "retail", value)}
                    onCommit={() => requestCommit(product, "retail")}
                  />
                  <ValueInput
                    field="artist"
                    label="Artist"
                    value={drafts[product.sku]?.artist ?? formatValue("artist", values[product.sku]?.artist ?? product.artistCents)}
                    tone="artist"
                    onChange={(value) => updateDraft(product.sku, "artist", value)}
                    onCommit={() => requestCommit(product, "artist")}
                  />
                  <div className="rounded bg-[#eaf7ef] p-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#9a6d38]">Mini Wholesale</p>
                    <div className="grid gap-2">
                      <ValueInput
                        field="miniWholesale"
                        label="Price"
                        value={
                          drafts[product.sku]?.miniWholesale ??
                          formatValue("miniWholesale", values[product.sku]?.miniWholesale ?? product.miniWholesaleCents)
                        }
                        tone="miniWholesale"
                        onChange={(value) => updateDraft(product.sku, "miniWholesale", value)}
                        onCommit={() => requestCommit(product, "miniWholesale")}
                      />
                      <ValueInput
                        field="miniWholesaleMoq"
                        label="MOQ"
                        value={
                          drafts[product.sku]?.miniWholesaleMoq ??
                          formatValue("miniWholesaleMoq", values[product.sku]?.miniWholesaleMoq ?? product.miniWholesaleMoq)
                        }
                        tone="miniWholesale"
                        onChange={(value) => updateDraft(product.sku, "miniWholesaleMoq", value)}
                        onCommit={() => requestCommit(product, "miniWholesaleMoq")}
                      />
                    </div>
                  </div>
                  <div className="rounded bg-[#fff2bf] p-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#9a6d38]">Bulk Wholesale</p>
                    <div className="grid gap-2">
                      <ValueInput
                        field="bulkWholesale"
                        label="Price"
                        value={
                          drafts[product.sku]?.bulkWholesale ??
                          formatValue("bulkWholesale", values[product.sku]?.bulkWholesale ?? product.bulkWholesaleCents)
                        }
                        tone="bulkWholesale"
                        onChange={(value) => updateDraft(product.sku, "bulkWholesale", value)}
                        onCommit={() => requestCommit(product, "bulkWholesale")}
                      />
                      <ValueInput
                        field="bulkWholesaleMoq"
                        label="MOQ"
                        value={
                          drafts[product.sku]?.bulkWholesaleMoq ??
                          formatValue("bulkWholesaleMoq", values[product.sku]?.bulkWholesaleMoq ?? product.bulkWholesaleMoq)
                        }
                        tone="bulkWholesale"
                        onChange={(value) => updateDraft(product.sku, "bulkWholesaleMoq", value)}
                        onCommit={() => requestCommit(product, "bulkWholesaleMoq")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FloatingNotice
        saving={saving && !pendingChange && !saveError}
        saveNotice={saveNotice}
        sessionReady={sessionReady}
        onDismissNotice={() => setSaveNotice("")}
      />

      {(pendingChange || saveError) && (
        <SaveDialog
          error={saveError}
          pendingChange={pendingChange}
          saving={saving}
          unlockPassword={unlockPassword}
          onCancel={saveError && !pendingChange ? () => setSaveError(null) : cancelPendingChange}
          onConfirm={() => void confirmPendingChange()}
          onRetry={() => void retryPendingSave()}
          onUnlock={() => void unlockAndRetry()}
          onUnlockPassword={setUnlockPassword}
        />
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

      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => scrollPage("top")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#a67146] text-white shadow-lg"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Scroll to bottom"
          onClick={() => scrollPage("bottom")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#a67146] text-white shadow-lg"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function scrollPage(to: "top" | "bottom") {
  const root = document.scrollingElement || document.documentElement;
  const top = to === "top" ? 0 : root.scrollHeight;
  root.scrollTo({ top, behavior: "smooth" });
  window.scrollTo({ top, behavior: "smooth" });
}

function SaveDialog({
  error,
  onCancel,
  onConfirm,
  onRetry,
  onUnlock,
  onUnlockPassword,
  pendingChange,
  saving,
  unlockPassword
}: {
  error: PriceSaveError | null;
  onCancel: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  onUnlock: () => void;
  onUnlockPassword: (value: string) => void;
  pendingChange: PendingChange | null;
  saving: boolean;
  unlockPassword: string;
}) {
  const box = useVisualViewportBox();

  return (
    <div
      className="fixed inset-x-0 z-[80] flex items-end justify-center p-3 sm:items-center"
      style={{ top: box.top, height: box.height }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 w-full max-w-md overflow-y-auto rounded-[0.5rem] border border-[#ead9c3] bg-white p-4 shadow-2xl">
        {saving ? (
          <div className="py-6 text-center">
            <p className="text-lg font-semibold text-[#2f2118]">Saving to the shop…</p>
            <p className="mt-2 text-sm text-[#8a6d56]">Keep this screen open until it finishes.</p>
          </div>
        ) : error ? (
          <div>
            <p className="text-lg font-semibold text-red-700">{error.title}</p>
            <p className="mt-2 text-sm leading-6 text-[#2f2118]">{error.message}</p>
            {pendingChange ? (
              <p className="mt-2 text-sm font-semibold text-[#6d4b32]">
                {pendingChange.name}: {formatValueForMessage(pendingChange.field, pendingChange.previous)} →{" "}
                {formatValueForMessage(pendingChange.field, pendingChange.next)}
              </p>
            ) : null}
            <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-[0.5rem] bg-[#fbf4e8] p-3 text-left text-xs leading-5 text-[#2f2118]">
              {formatSaveErrorDump(error, pendingChange)}
            </pre>
            {(error.needsUnlock || error.code === "BAD_PASSWORD") && (
              <label className="mt-3 block text-sm font-semibold text-[#6d4b32]">
                List password
                <input
                  type="password"
                  value={unlockPassword}
                  onChange={(event) => onUnlockPassword(event.target.value)}
                  className="mt-2 h-11 w-full rounded-[0.5rem] border border-[#ead9c3] bg-white px-3 text-base text-[#2f2118] outline-none"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </label>
            )}
            <div className="mt-4 grid gap-2">
              {error.needsUnlock || error.code === "BAD_PASSWORD" ? (
                <button
                  type="button"
                  onClick={onUnlock}
                  className="h-12 rounded-[0.5rem] bg-[#a67146] text-base font-semibold text-white"
                >
                  Unlock and save
                </button>
              ) : pendingChange ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="h-12 rounded-[0.5rem] bg-[#a67146] text-base font-semibold text-white"
                >
                  Retry save
                </button>
              ) : null}
              <button
                type="button"
                onClick={onCancel}
                className="h-12 rounded-[0.5rem] border border-[#ead9c3] bg-white text-base font-semibold text-[#6d4b32]"
              >
                {pendingChange ? "Cancel" : "Close"}
              </button>
            </div>
          </div>
        ) : pendingChange ? (
          <div>
            <p className="text-lg font-semibold text-[#2f2118]">Save this change to the shop?</p>
            <p className="mt-2 text-sm text-[#8a6d56]">
              {pendingChange.name}: {formatValueForMessage(pendingChange.field, pendingChange.previous)} to{" "}
              {formatValueForMessage(pendingChange.field, pendingChange.next)}
            </p>
            <p className="mt-2 text-sm text-[#6d4b32]">
              Confirm writes this value for every phone and computer that opens this list
              {pendingChange.field === "retail" ? ", and updates the shop website." : "."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="h-12 rounded-[0.5rem] border border-[#ead9c3] bg-white text-base font-semibold text-[#6d4b32]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="h-12 rounded-[0.5rem] bg-[#a67146] text-base font-semibold text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatSaveErrorDump(error: PriceSaveError, pendingChange: PendingChange | null) {
  const lines = [
    `Time: ${error.time}`,
    `Host: ${error.host}`,
    `Path: ${error.path}`,
    `Status: ${error.httpStatus ?? "no HTTP response"}`,
    `Code: ${error.code}`,
    `Sync ID: ${error.syncId}`,
    `Tries: ${error.tries}`,
    `Browser online: ${error.online ? "yes" : "no"}`,
    pendingChange ? `SKU: ${pendingChange.sku}` : "",
    pendingChange ? `Field: ${pendingChange.field}` : "",
    pendingChange ? `New value: ${formatValueForMessage(pendingChange.field, pendingChange.next)}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    `Detail: ${error.detail}`
  ];
  return lines.filter(Boolean).join("\n");
}

function useVisualViewportBox() {
  const [box, setBox] = useState({ top: 0, height: 800 });

  useEffect(() => {
    function update() {
      const viewport = window.visualViewport;
      if (viewport) {
        setBox({ top: Math.round(viewport.offsetTop), height: Math.round(viewport.height) });
        return;
      }
      setBox({ top: 0, height: window.innerHeight });
    }

    update();
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return box;
}

function FloatingNotice({
  onDismissNotice,
  saveNotice,
  saving,
  sessionReady
}: {
  onDismissNotice: () => void;
  saveNotice: string;
  saving: boolean;
  sessionReady: boolean;
}) {
  const box = useVisualViewportBox();
  if (!saving && !saveNotice && sessionReady) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 z-[90] flex justify-center px-3" style={{ top: box.top + 12 }}>
      <div className="pointer-events-auto w-full max-w-md">
        {saving ? (
          <p className="rounded-[0.5rem] border border-[#ead9c3] bg-white px-4 py-3 text-center text-sm font-semibold text-[#a67146] shadow-2xl">
            Saving to the list…
          </p>
        ) : saveNotice ? (
          <p className="flex items-start gap-2 rounded-[0.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-2xl">
            <span className="flex-1">{saveNotice}</span>
            <button
              type="button"
              onClick={onDismissNotice}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-emerald-800"
              aria-label="Dismiss saved message"
            >
              <X className="h-4 w-4" />
            </button>
          </p>
        ) : (
          <p className="rounded-[0.5rem] border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700 shadow-2xl">
            This browser is not logged in for saving. If a save fails, type the list password in the popup.
          </p>
        )}
      </div>
    </div>
  );
}

function CatalogButton({
  kind,
  label,
  loading,
  onClick
}: {
  kind: PriceCatalogKind;
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  const tone =
    kind === "market"
      ? "border-[#ead9c3] bg-[#fbf4e8] text-[#6d4b32]"
      : kind === "artist"
        ? "border-[#d9e9e1] bg-[#edf7f3] text-[#245c48]"
        : kind === "mini"
          ? "border-[#d9eadc] bg-[#eaf7ef] text-[#2f6a45]"
          : "border-[#eadfbd] bg-[#fff2bf] text-[#704b18]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.5rem] border px-3 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-70 ${tone}`}
    >
      <FileDown className="h-4 w-4" />
      {loading ? "Preparing..." : label}
    </button>
  );
}

function ValueInput({
  field,
  label,
  onChange,
  onCommit,
  showCommitButton = true,
  tone = "default",
  value
}: {
  field: ValueField;
  label: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  showCommitButton?: boolean;
  tone?: "default" | "artist" | "miniWholesale" | "bulkWholesale";
  value: string;
}) {
  const isMoq = isMoqField(field);
  const toneClass =
    tone === "artist"
      ? "bg-[#edf7f3]"
      : tone === "miniWholesale"
        ? "bg-[#f8fff8]"
        : tone === "bulkWholesale"
          ? "bg-[#fff9df]"
          : "bg-[#fbf4e8]";

  return (
    <label
      className={`grid items-center gap-2 rounded px-2 py-2 ${toneClass} ${
        showCommitButton ? "grid-cols-[64px_1fr_auto]" : "grid-cols-[76px_1fr]"
      }`}
    >
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
      {showCommitButton ? (
        <button
          type="button"
          tabIndex={-1}
          onPointerDown={(event) => {
            event.preventDefault();
            onCommit();
          }}
          className="h-10 rounded-[0.5rem] bg-[#a67146] px-3 text-sm font-semibold text-white"
        >
          Save
        </button>
      ) : null}
    </label>
  );
}

function createDefaultValues(products: PriceListProduct[], listOverrides: Record<string, PriceListOverride> = {}) {
  return products.reduce<ValueMap>((map, product) => {
    const override = listOverrides[product.sku] ?? {};
    map[product.sku] = {
      retail: override.retail ?? product.retailCents,
      artist: override.artist ?? product.artistCents,
      miniWholesale: override.miniWholesale ?? product.miniWholesaleCents,
      miniWholesaleMoq: override.miniWholesaleMoq ?? product.miniWholesaleMoq,
      bulkWholesale: override.bulkWholesale ?? product.bulkWholesaleCents,
      bulkWholesaleMoq: override.bulkWholesaleMoq ?? product.bulkWholesaleMoq
    };
    return map;
  }, {});
}

function storedOverrides(products: PriceListProduct[], values: ValueMap): StoredValueMap {
  const defaults = createDefaultValues(products);
  const stored: StoredValueMap = {};

  for (const product of products) {
    const current = values[product.sku];
    const baseline = defaults[product.sku];
    if (!current || !baseline) continue;

    const diff: Partial<ProductValues> = {};
    for (const field of valueFields) {
      if (current[field] !== baseline[field]) {
        diff[field] = current[field];
      }
    }

    if (Object.keys(diff).length) {
      stored[product.sku] = diff;
    }
  }

  return stored;
}

function createDrafts(values: ValueMap) {
  return Object.fromEntries(
    Object.entries(values).map(([sku, item]) => [
      sku,
      {
        retail: formatValue("retail", item.retail),
        artist: formatValue("artist", item.artist),
        miniWholesale: formatValue("miniWholesale", item.miniWholesale),
        miniWholesaleMoq: formatValue("miniWholesaleMoq", item.miniWholesaleMoq),
        bulkWholesale: formatValue("bulkWholesale", item.bulkWholesale),
        bulkWholesaleMoq: formatValue("bulkWholesaleMoq", item.bulkWholesaleMoq)
      }
    ])
  ) as DraftMap;
}

function mergeWithDefaults(
  products: PriceListProduct[],
  storedValues: StoredValueMap,
  options: { listOverrides?: Record<string, PriceListOverride> } = {}
) {
  const defaults = createDefaultValues(products, options.listOverrides);
  return Object.fromEntries(
    products.map((product) => {
      const stored = storedValues[product.sku] ?? {};
      return [
        product.sku,
        {
          ...defaults[product.sku],
          retail: stored.retail ?? defaults[product.sku].retail,
          artist: stored.artist ?? defaults[product.sku].artist,
          miniWholesale: stored.miniWholesale ?? defaults[product.sku].miniWholesale,
          miniWholesaleMoq: stored.miniWholesaleMoq ?? defaults[product.sku].miniWholesaleMoq,
          bulkWholesale: stored.bulkWholesale ?? stored.wholesale ?? defaults[product.sku].bulkWholesale,
          bulkWholesaleMoq: stored.bulkWholesaleMoq ?? stored.moq ?? defaults[product.sku].bulkWholesaleMoq
        }
      ];
    })
  ) as ValueMap;
}

function formatValue(field: ValueField, value: number) {
  return isMoqField(field) ? String(value) : centsToInput(value);
}

function formatValueForMessage(field: ValueField, value: number) {
  return isMoqField(field) ? `${value} pcs` : `$${centsToInput(value)}`;
}

function isMoqField(field: ValueField) {
  return field.endsWith("Moq");
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

function getCatalogFilename(kind: PriceCatalogKind) {
  const names: Record<PriceCatalogKind, string> = {
    artist: "SiconArt_Artist_Price_Catalog.pdf",
    bulk: "SiconArt_Bulk_Wholesale_Catalog.pdf",
    market: "SiconArt_Market_Price_Catalog.pdf",
    mini: "SiconArt_MINI_Wholesale_Catalog.pdf"
  };
  return names[kind];
}

function readJson<T>(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}
