import "server-only";
import { prisma } from "@/lib/prisma";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function isThrottled(key: string) {
  const row = await prisma.authThrottle.findUnique({ where: { key } });
  return (
    !!row &&
    row.failures >= MAX_FAILURES &&
    Date.now() - row.windowStartedAt.getTime() < WINDOW_MS
  );
}

export async function recordFailure(key: string) {
  const row = await prisma.authThrottle.findUnique({ where: { key } });
  const windowOver =
    !row || Date.now() - row.windowStartedAt.getTime() >= WINDOW_MS;

  await prisma.authThrottle.upsert({
    where: { key },
    create: { key, failures: 1 },
    update: windowOver
      ? { failures: 1, windowStartedAt: new Date() }
      : { failures: { increment: 1 } },
  });
}

export async function clearFailures(key: string) {
  await prisma.authThrottle.deleteMany({ where: { key } });
}
