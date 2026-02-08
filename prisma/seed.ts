import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Walnut Creek area — within ~10 miles of 94598
const allowedZipCodes = [
  "94518", "94519", "94520", "94521", "94523",
  "94549", "94553", "94556", "94563", "94595",
  "94596", "94597", "94598",
];

async function main() {
  console.log("Clearing old zip codes...");
  await prisma.allowedZipCode.deleteMany({});

  console.log("Seeding allowed zip codes...");
  for (const zipCode of allowedZipCodes) {
    await prisma.allowedZipCode.upsert({
      where: { zipCode },
      update: {},
      create: { zipCode },
    });
  }

  console.log(`Seeded ${allowedZipCodes.length} allowed zip codes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
