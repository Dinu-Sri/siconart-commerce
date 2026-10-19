import { emailLayout, escapeHtml, paragraph } from "@/lib/email";

export function buildUnpaidRecoveryEmail(input: {
  firstName: string;
  orderNumber: string;
  code: string;
  percent: number;
  saveLabel: string;
  hours: number;
  checkoutUrl: string;
  itemNames: string[];
  expiresAt: Date;
}) {
  const name = escapeHtml(input.firstName);
  const code = escapeHtml(input.code);
  const save = escapeHtml(input.saveLabel);
  const orderNumber = escapeHtml(input.orderNumber);
  const hours = String(input.hours);
  const expires = escapeHtml(
    input.expiresAt.toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short"
    })
  );
  const items =
    input.itemNames.length === 0
      ? "the brushes you chose"
      : input.itemNames.length === 1
        ? escapeHtml(input.itemNames[0])
        : `${input.itemNames
            .slice(0, -1)
            .map((item) => escapeHtml(item))
            .join(", ")} and ${escapeHtml(input.itemNames[input.itemNames.length - 1])}`;

  const subject = `${input.firstName}, save ${input.saveLabel} on your Sicon Art order — ${input.hours} hours only`;

  const html = emailLayout(
    `${name}, your brushes are still waiting`,
    `
      ${paragraph(`I noticed you started order <strong>${orderNumber}</strong> for ${items}, and payment is not finished yet. That is easy to do — PayHere can close before the card goes through.`)}
      ${paragraph(`I set aside a <strong>lucky ${input.percent}% studio gift</strong> for you, one time only. It takes <strong>${save}</strong> off the brushes. Shipping stays as quoted.`)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;background:#f7efe3;border:1px solid #ead9c3;border-radius:14px;">
        <tr>
          <td style="padding:20px 22px;text-align:center;">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#A67146;">Your one-time code</p>
            <p style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.08em;color:#523A27;">${code}</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#523A27;">Save <strong>${save}</strong> · valid <strong>${hours} hours</strong></p>
            <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#8B7355;">Expires ${expires}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 18px;text-align:center;">
        <a href="${input.checkoutUrl}" style="display:inline-block;padding:14px 26px;background:#A67146;color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;line-height:1;">Complete checkout and save ${save}</a>
      </p>
      ${paragraph(`<strong>How to use it</strong><br>1. Tap the button above. Your brushes and this code will be waiting at checkout.<br>2. Confirm your email is the same one you used for this order.<br>3. Pay within ${hours} hours. After that, <strong>${code}</strong> closes.`)}
      ${paragraph(`This code works <strong>once</strong>, and only for this email. It will not work a second time.`)}
      ${paragraph(`If PayHere gave you trouble, try another card, or reply and we will help you finish the order.`)}
      ${paragraph(`Warmly,<br>Sicon Art workshop`)}
    `
  );

  return { subject, html };
}
