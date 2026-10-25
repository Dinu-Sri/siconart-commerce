import { emailLayout, escapeHtml, paragraph } from "@/lib/email";
import { siteOrigin } from "@/lib/site-origin";
import { yuntrackUrl } from "@/lib/yuntrack-shared";

export function buildTrackingEmail(input: {
  firstName: string;
  orderNumber: string;
  trackingNumber: string;
}) {
  const name = escapeHtml(input.firstName);
  const orderNumber = escapeHtml(input.orderNumber);
  const code = escapeHtml(input.trackingNumber);
  const carrierUrl = yuntrackUrl(input.trackingNumber);
  const pageUrl = `${siteOrigin()}/track-your-order?code=${encodeURIComponent(input.trackingNumber)}`;
  const subject = `${input.firstName}, your Sicon Art order ${input.orderNumber} is on the way`;
  const html = emailLayout(
    `${name}, your brushes have shipped`,
    `
      ${paragraph(`Order <strong>${orderNumber}</strong> has left the workshop. Your YunExpress tracking number is ready.`)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;background:#f7efe3;border:1px solid #ead9c3;border-radius:14px;">
        <tr>
          <td style="padding:20px 22px;text-align:center;">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#A67146;">Tracking number</p>
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:0.04em;color:#523A27;">${code}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 18px;text-align:center;">
        <a href="${pageUrl}" style="display:inline-block;padding:14px 26px;background:#A67146;color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;line-height:1;">Track this parcel</a>
      </p>
      ${paragraph(`<strong>How to track</strong><br>1. Open the button above, or go to siconart.com/track-your-order.<br>2. Your number <strong>${code}</strong> will be filled in.<br>3. You can also open the carrier page directly: <a href="${carrierUrl}">YunExpress tracking</a>.<br>4. International scans can pause for a few days during airline and customs handoff. That gap is normal.`)}
      ${paragraph(`Warmly,<br>Sicon Art workshop`)}
    `
  );
  return { subject, html, pageUrl, carrierUrl };
}
