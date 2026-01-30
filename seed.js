const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.coordinator.createMany({
    data: [
      // Civil
      { name: "Aman Civil", branch: "Civil" },
      { name: "Riya Civil", branch: "Civil" },

      // Computer Science
      { name: "Rahul CS", branch: "Computer Science" },
      { name: "Sneha CS", branch: "Computer Science" },

      // Mechanical
      { name: "Kunal ME", branch: "Mechanical" },
      { name: "Pooja ME", branch: "Mechanical" },

      // Electrical
      { name: "Arjun EE", branch: "Electrical" },
      { name: "Neha EE", branch: "Electrical" },

      // ECE + Meta + EP
      { name: "Vikas ECE", branch: "ECE+Meta+EP" },
      { name: "Ananya ECE", branch: "ECE+Meta+EP" },

      // M.Sc. + ITEP
      { name: "Saurav MSc", branch: "M.Sc. + ITEP" },
      { name: "Isha MSc", branch: "M.Sc. + ITEP" },

      // PhD
      { name: "Dr. Raj PhD", branch: "PhD" },
      { name: "Dr. Meera PhD", branch: "PhD" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Coordinators seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
