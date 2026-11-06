import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Identifier } from "./identifier";

const CODE_LIFETIME_MS = 2 * 60 * 1000;
const RESEND_INTERVAL_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

/** Read at request time. Off until an SMS and email provider are connected (ADR 0008). */
export function isOtpEnabled() {
  return process.env.AUTH_OTP_ENABLED === "true";
}

function hashCode(target: string, code: string) {
  return createHash("sha256").update(`${target}:${code}`).digest();
}

// Connect the real SMS and email providers here.
async function deliver(identifier: Identifier, code: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("No OTP delivery provider is configured.");
  }
  console.info(`[otp] code for ${identifier.value}: ${code}`);
}

export async function sendOtp(identifier: Identifier) {
  const target = identifier.value;

  const recent = await prisma.otpCode.findFirst({
    where: {
      target,
      createdAt: { gt: new Date(Date.now() - RESEND_INTERVAL_MS) },
    },
  });
  if (recent) return;

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");

  await prisma.otpCode.updateMany({
    where: { target, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  await prisma.otpCode.create({
    data: {
      channel: identifier.kind === "email" ? "EMAIL" : "SMS",
      target,
      codeHash: hashCode(target, code).toString("hex"),
      expiresAt: new Date(Date.now() + CODE_LIFETIME_MS),
    },
  });

  await deliver(identifier, code);
}

export async function checkOtp(identifier: Identifier, code: string) {
  const target = identifier.value;
  const otp = await prisma.otpCode.findFirst({
    where: { target, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp || otp.attempts >= MAX_ATTEMPTS) return false;

  const matches = timingSafeEqual(
    Buffer.from(otp.codeHash, "hex"),
    hashCode(target, code),
  );

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: matches
      ? { consumedAt: new Date() }
      : { attempts: { increment: 1 } },
  });
  return matches;
}
