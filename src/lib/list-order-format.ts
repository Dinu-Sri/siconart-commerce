export function formatListMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function formatListDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function formatListStatus(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function paymentBadgeClass(status: string) {
  if (status === "PAID") return "bg-[#1f7a46] text-white";
  if (status === "UNPAID" || status === "FAILED") return "bg-[#c2410c] text-white";
  if (status === "REFUNDED") return "bg-[#6b7280] text-white";
  return "bg-[#b45309] text-white";
}
