"use server";

import { redirect } from "next/navigation";
import { parseIdentifier, type Identifier } from "@/lib/auth/identifier";
import { checkOtp, isOtpEnabled, sendOtp } from "@/lib/auth/otp";
import {
  burnPasswordCheck,
  hashPassword,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  verifyPassword,
} from "@/lib/auth/password";
import { panelPath } from "@/lib/auth/roles";
import { createSession, destroySession } from "@/lib/auth/session";
import { clearFailures, isThrottled, recordFailure } from "@/lib/auth/throttle";
import { prisma } from "@/lib/prisma";

export type FormState = {
  error?: string;
  otpSentTo?: string;
  // React clears a form after its action runs, so fields to keep come back here.
  values?: { name?: string; identifier?: string };
};

const THROTTLED = "تلاش‌های ناموفق زیاد بود. ۱۵ دقیقه دیگر دوباره امتحان کن.";
const BAD_IDENTIFIER = "ایمیل یا شماره موبایل معتبر وارد کن.";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

function findByIdentifier(identifier: Identifier) {
  return prisma.user.findUnique({
    where:
      identifier.kind === "email"
        ? { email: identifier.value }
        : { phone: identifier.value },
  });
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const raw = field(formData, "identifier");
  const values = { identifier: raw };
  const identifier = parseIdentifier(raw);
  const password = field(formData, "password");
  if (!identifier) return { error: BAD_IDENTIFIER, values };
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { error: "ایمیل، موبایل یا رمز عبور اشتباه است.", values };
  }

  const key = `login:${identifier.value}`;
  if (await isThrottled(key)) return { error: THROTTLED, values };

  const user = await findByIdentifier(identifier);
  let valid = false;
  if (user?.passwordHash) {
    valid = await verifyPassword(password, user.passwordHash);
  } else {
    await burnPasswordCheck(password);
  }

  if (!user || !valid) {
    await recordFailure(key);
    return { error: "ایمیل، موبایل یا رمز عبور اشتباه است.", values };
  }

  await clearFailures(key);
  await createSession(user.id);
  redirect(panelPath(user.role));
}

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const name = field(formData, "name").trim();
  const raw = field(formData, "identifier");
  const values = { name, identifier: raw };
  const identifier = parseIdentifier(raw);
  const password = field(formData, "password");

  if (name.length < 2 || name.length > 100) return { error: "نام را کامل وارد کن.", values };
  if (!identifier) return { error: BAD_IDENTIFIER, values };
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return { error: `رمز عبور باید حداقل ${PASSWORD_MIN_LENGTH} کاراکتر باشد.`, values };
  }

  let userId: string;
  let role;
  try {
    // New accounts are always students. Only an admin can grant another role.
    const user = await prisma.user.create({
      data: {
        name,
        [identifier.kind]: identifier.value,
        passwordHash: await hashPassword(password),
      },
    });
    userId = user.id;
    role = user.role;
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return { error: "با این ایمیل یا موبایل قبلاً ثبت‌نام شده است.", values };
    }
    throw error;
  }

  await createSession(userId);
  redirect(panelPath(role));
}

export async function requestOtp(_: FormState, formData: FormData): Promise<FormState> {
  if (!isOtpEnabled()) return { error: "ورود با کد یک‌بارمصرف فعال نیست." };

  const raw = field(formData, "identifier");
  const identifier = parseIdentifier(raw);
  if (!identifier) return { error: BAD_IDENTIFIER };

  // Same response either way, so this can't be used to discover who has an account.
  if (await findByIdentifier(identifier)) await sendOtp(identifier);
  return { otpSentTo: raw };
}

export async function verifyOtp(_: FormState, formData: FormData): Promise<FormState> {
  if (!isOtpEnabled()) return { error: "ورود با کد یک‌بارمصرف فعال نیست." };

  const raw = field(formData, "identifier");
  const identifier = parseIdentifier(raw);
  if (!identifier) return { error: BAD_IDENTIFIER };

  const key = `otp:${identifier.value}`;
  if (await isThrottled(key)) return { error: THROTTLED, otpSentTo: raw };

  const user = await findByIdentifier(identifier);
  const valid = await checkOtp(identifier, field(formData, "code").trim());
  if (!user || !valid) {
    await recordFailure(key);
    return { error: "کد اشتباه یا منقضی شده است.", otpSentTo: raw };
  }

  await clearFailures(key);
  await prisma.user.update({
    where: { id: user.id },
    data:
      identifier.kind === "email"
        ? { emailVerifiedAt: new Date() }
        : { phoneVerifiedAt: new Date() },
  });
  await createSession(user.id);
  redirect(panelPath(user.role));
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
