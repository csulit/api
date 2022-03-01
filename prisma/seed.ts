import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function seed() {
  await prismaClient.$transaction(async (prisma) => {
    //const surveys = await prisma.survey.count();

    //await prisma.survey.createMany({ data: survey });

    console.log('Surveys inserted!');
  });

  return 'Done! ';
}

seed()
  .then((result) => console.log(result))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(async () => await prismaClient.$disconnect());
