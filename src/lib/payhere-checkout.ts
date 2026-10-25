import crypto from "node:crypto";
import { siteOrigin } from "@/lib/site-origin";

export type PayHereAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  phone: string;
};

export function createPayHerePayload({
  orderNumber,
  amountCents,
  firstName,
  lastName,
  email,
  shipping,
  items,
  cancelPath
}: {
  orderNumber: string;
  amountCents: number;
  firstName: string;
  lastName: string;
  email: string;
  shipping: PayHereAddress;
  items: string;
  cancelPath?: string;
}) {
  const merchantId = requiredEnv("PAYHERE_MERCHANT_ID");
  const merchantSecret = requiredEnv("PAYHERE_MERCHANT_SECRET");
  const publicUrl = siteOrigin();
  const currency = process.env.PAYHERE_CURRENCY || "USD";
  const amount = (amountCents / 100).toFixed(2);
  const sandbox = process.env.PAYHERE_SANDBOX === "true";
  const action = sandbox ? "https://sandbox.payhere.lk/pay/checkout" : "https://www.payhere.lk/pay/checkout";

  return {
    sandbox,
    action,
    fields: {
      merchant_id: merchantId,
      return_url: `${publicUrl}/checkout/thank-you?order=${encodeURIComponent(orderNumber)}`,
      cancel_url: `${publicUrl}${cancelPath || `/checkout?cancelled=1&order=${encodeURIComponent(orderNumber)}`}`,
      notify_url: `${publicUrl}/api/payhere/notify`,
      order_id: orderNumber,
      items,
      currency,
      amount,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: shipping.phone,
      address: [shipping.line1, shipping.line2].filter(Boolean).join(", "),
      city: shipping.city,
      country: shipping.country,
      delivery_address: [shipping.line1, shipping.line2].filter(Boolean).join(", "),
      delivery_city: shipping.city,
      delivery_country: shipping.country,
      hash: payHereCheckoutHash(merchantId, orderNumber, amount, currency, merchantSecret)
    }
  };
}

function payHereCheckoutHash(merchantId: string, orderId: string, amount: string, currency: string, merchantSecret: string) {
  return md5(`${merchantId}${orderId}${amount}${currency}${md5(merchantSecret).toUpperCase()}`).toUpperCase();
}

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}
