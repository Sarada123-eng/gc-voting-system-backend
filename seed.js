const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.coordinator.createMany({
    data: [
      // Civil
      {
        name: "Aman Civil",
        branch: "Civil",
        photoUrl: "https://i.pravatar.cc/150?img=1",
      },
      {
        name: "Riya Civil",
        branch: "Civil",
        photoUrl: "https://i.pravatar.cc/150?img=2",
      },

      // Computer Science
      {
        name: "Rahul CS",
        branch: "Computer Science",
        photoUrl: "https://i.pravatar.cc/150?img=3",
      },
      {
        name: "Sneha CS",
        branch: "Computer Science",
        photoUrl: "https://i.pravatar.cc/150?img=4",
      },

      // Mechanical
      {
        name: "Kunal ME",
        branch: "Mechanical",
        photoUrl: "https://i.pravatar.cc/150?img=5",
      },
      {
        name: "Pooja ME",
        branch: "Mechanical",
        photoUrl: "https://i.pravatar.cc/150?img=6",
      },

      // Electrical
      {
        name: "Arjun EE",
        branch: "Electrical",
        photoUrl: "https://i.pravatar.cc/150?img=7",
      },
      {
        name: "Neha EE",
        branch: "Electrical",
        photoUrl: "https://i.pravatar.cc/150?img=8",
      },

      // ECE + Meta + EP
      {
        name: "Vikas ECE",
        branch: "ECE+Meta+EP",
        photoUrl: "https://i.pravatar.cc/150?img=9",
      },
      {
        name: "Ananya ECE",
        branch: "ECE+Meta+EP",
        photoUrl: "https://i.pravatar.cc/150?img=10",
      },

      // M.Sc. + ITEP
      {
        name: "Saurav MSc",
        branch: "M.Sc. + ITEP",
        photoUrl: "https://i.pravatar.cc/150?img=11",
      },
      {
        name: "Isha MSc",
        branch: "M.Sc. + ITEP",
        photoUrl: "https://i.pravatar.cc/150?img=12",
      },

      // PhD
      {
        name: "Dr. Raj PhD",
        branch: "PhD",
        photoUrl: "https://i.pravatar.cc/150?img=13",
      },
      {
        name: "Dr. Meera PhD",
        branch: "PhD",
        photoUrl: "https://i.pravatar.cc/150?img=14",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Coordinators seeded successfully with photos");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
