import { db } from "@/lib/db";

export async function quoteDiscountCode(code: string | undefined, subtotalCents: number, email?: string) {
  const normalizedCode = code?.trim().toUpperCase();
  if (!normalizedCode) return null;

  const discount = await db.discountCode.findUnique({ where: { code: normalizedCode } });
  const now = new Date();

  if (!discount || !discount.active) throw new Error("Discount code is not active");
  if (discount.startsAt && discount.startsAt > now) throw new Error("Discount code is not active yet");
  if (discount.endsAt && discount.endsAt < now) throw new Error("Discount code has expired");
  if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) {
    throw new Error("Discount code usage limit reached");
  }
  if (discount.allowedEmail) {
    const checkoutEmail = email?.trim().toLowerCase();
    if (!checkoutEmail) return null;
    if (checkoutEmail !== discount.allowedEmail.trim().toLowerCase()) {
      throw new Error("This discount code is for a different customer");
    }
  }
  if (subtotalCents < discount.minSubtotalCents) {
    throw new Error(`Discount requires a minimum order of $${(discount.minSubtotalCents / 100).toFixed(0)}`);
  }

  const discountCents =
    discount.type === "percent"
      ? Math.floor((subtotalCents * discount.value) / 100)
      : Math.min(subtotalCents, discount.value);

  return { code: discount.code, discountCents, id: discount.id, usageLimit: discount.usageLimit, usedCount: discount.usedCount };
}
