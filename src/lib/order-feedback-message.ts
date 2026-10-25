export const FEEDBACK_THANKS =
  "Thank you for choosing Sicon Art. We would really appreciate it if you can share your feedback with us.";

export function feedbackPath(token: string) {
  return `/feedback/${token}`;
}

export function feedbackRequestMessage(url: string) {
  return `${FEEDBACK_THANKS}\n\n${url}`;
}

export function isFeedbackToken(token: string) {
  return /^[A-Za-z0-9_-]{16,64}$/.test(token);
}
