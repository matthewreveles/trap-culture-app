
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
      take: 3,
    });
    console.log("✅ Prisma connected successfully.");
    console.log("Sample users:", users);
  } catch (err) {
    console.error("❌ Prisma test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

