export const SUPPORT_EMAIL = "support@siconart.com";
export const SUPPORT_WHATSAPP = "+85257423547";
export const SUPPORT_WHATSAPP_DISPLAY = "+852 5742 3547";
export const SUPPORT_WHATSAPP_LINK =
  "https://wa.me/85257423547?text=" + encodeURIComponent("Hello Sicon Art, I have a question about an order.");
export const SITE_NAME = "Sicon Art";

export function whatsappShippingHelpLink(countryName: string) {
  return (
    "https://wa.me/85257423547?text=" +
    encodeURIComponent(
      `Hello Sicon Art, my country is ${countryName}. Shipping is not calculated automatically. Please calculate shipping and tell me how to place the order.`
    )
  );
}
