import prisma from './prisma';

async function main() {
  console.log('Starting seeding...');

  // Ejemplo: Crear usuarios de ejemplo
  const rates = await prisma.rate.createMany({
    data: [
      { date: '2025-01-30T00:00:00-04:00', rate: 57.1023, rateEUR: 61.3456 },

    ],
  });

  console.log(`Seeding completed: ${rates.count} rates created.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error during seeding:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
