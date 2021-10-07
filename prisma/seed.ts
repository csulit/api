import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function seed() {
  const transaction = await prismaClient.$transaction([]);

  return transaction;
}

seed()
  .then((result) => console.log(result))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(async () => await prismaClient.$disconnect());
