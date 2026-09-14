export const SUPPORT_EMAIL = "support@siconart.com";
export const SUPPORT_WHATSAPP = "+85257423547";
export const SUPPORT_WHATSAPP_DISPLAY = "+852 5742 3547";
export const SUPPORT_WHATSAPP_LINK =
  "https://wa.me/85257423547?text=" + encodeURIComponent("Hello Sicon Art, I have a question about an order.");
export const SUPPORT_INSTAGRAM_LINK = "https://www.instagram.com/siconarts/";
// Set this to the business page or Messenger URL when Facebook support is ready.
export const SUPPORT_FACEBOOK_LINK = process.env.NEXT_PUBLIC_SUPPORT_FACEBOOK_URL?.trim() || null;
export const SITE_NAME = "Sicon Art";

export function whatsappShippingHelpLink(countryName: string) {
  return (
    "https://wa.me/85257423547?text=" +
    encodeURIComponent(
      `Hello Sicon Art, my country is ${countryName}. Shipping is not calculated automatically. Please calculate shipping and tell me how to place the order.`
    )
  );
}

export function whatsappLargeOrderShippingHelpLink(countryName: string, estimatedWeightGrams: number) {
  return (
    "https://wa.me/85257423547?text=" +
    encodeURIComponent(
      `Hello Sicon Art, I am ordering ${estimatedWeightGrams}g estimated weight to ${countryName}. Please send me the best shipping rate for an order over 1 kg.`
    )
  );
}
