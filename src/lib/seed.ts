import prisma from './prisma';

async function main() {
  console.log('Starting seeding...');

  // Ejemplo: Crear usuarios de ejemplo
  const rates = await prisma.rate.createMany({
    data: [
      { date: '2025-01-30T00:00:00-04:00', rate: 57.1023 },
      { date: '2025-01-29T00:00:00-04:00', rate: 56.1301 },
      { date: '2025-01-28T00:00:00-04:00', rate: 55.1301 },
      { date: '2025-01-27T00:00:00-04:00', rate: 54.1301 },
      { date: '2025-01-26T00:00:00-04:00', rate: 53.1301 },
      { date: '2025-01-25T00:00:00-04:00', rate: 52.1301 },
      { date: '2025-01-24T00:00:00-04:00', rate: 51.1301 },
      { date: '2025-01-23T00:00:00-04:00', rate: 50.1301 },
      { date: '2025-01-22T00:00:00-04:00', rate: 49.1301 },
      { date: '2025-01-21T00:00:00-04:00', rate: 48.1301 },
      { date: '2025-01-20T00:00:00-04:00', rate: 47.1301 },
      { date: '2025-01-19T00:00:00-04:00', rate: 46.1301 },
      { date: '2025-01-18T00:00:00-04:00', rate: 45.1301 },
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
