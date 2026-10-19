import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCertificateCode() {
  let raw = "";
  for (let index = 0; index < 8; index += 1) {
    raw += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `SA-${raw.slice(0, 4)}-${raw.slice(4)}`;
}
