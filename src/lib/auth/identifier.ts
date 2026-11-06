export type Identifier =
  | { kind: "email"; value: string }
  | { kind: "phone"; value: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IRAN_MOBILE = /^(?:\+98|0098|98|0)?(9\d{9})$/;

// Mobile keyboards in Iran often type Persian or Arabic digits.
function toLatinDigits(input: string) {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** Returns the canonical email or phone, or null if the input is neither. */
export function parseIdentifier(raw: string): Identifier | null {
  const input = toLatinDigits(raw).trim();

  if (input.includes("@")) {
    const email = input.toLowerCase();
    return email.length <= 254 && EMAIL.test(email)
      ? { kind: "email", value: email }
      : null;
  }

  const match = input.replace(/[\s-]/g, "").match(IRAN_MOBILE);
  return match ? { kind: "phone", value: `+98${match[1]}` } : null;
}
