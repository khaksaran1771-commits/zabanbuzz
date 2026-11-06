// Promotes an existing user to admin. Usage: npm run admin:make -- <email-or-phone>
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { parseIdentifier } from "../src/lib/auth/identifier";

const identifier = parseIdentifier(process.argv[2] ?? "");
if (!identifier) {
  console.error("Usage: npm run admin:make -- <email-or-phone>");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

try {
  const { count } = await prisma.user.updateMany({
    where: { [identifier.kind]: identifier.value },
    data: { role: "ADMIN" },
  });
  if (count === 0) {
    console.error("No user found. Register first, then run this again.");
    process.exitCode = 1;
  } else {
    console.log(`${identifier.value} is now an admin.`);
  }
} finally {
  await prisma.$disconnect();
}
