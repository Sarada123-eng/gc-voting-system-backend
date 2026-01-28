const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const coordinators = [
    // Civil
    { name: "Alice Civil", branch: "Civil" },
    { name: "Bob Civil", branch: "Civil" },

    // Computer Science
    { name: "Charlie CS", branch: "Computer Science" },
    { name: "Dave CS", branch: "Computer Science" },

    // Mechanical
    { name: "Eve ME", branch: "Mechanical" },

    // Electrical
    { name: "Frank EE", branch: "Electrical" }
  ];

  for (const coord of coordinators) {
    await prisma.coordinator.upsert({
      where: {
        // create a composite unique later if you want,
        // for now we match by name + branch manually
        id: -1
      },
      create: coord,
      update: {}
    });
  }

  console.log("✅ Coordinators seeded");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
