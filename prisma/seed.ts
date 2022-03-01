import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function seed() {
  await prismaClient.$transaction(async (prisma) => {
    const surveys = await prisma.survey.count();

    if (!surveys) {
      //await prisma.survey.createMany({ data: survey });

      const x = await prisma.userQrCode.findMany();

      x.forEach(
        async (y) =>
          await prisma.userQrCode.update({
            where: { id: y.id },
            data: {
              qrUrl: y.qrUrl.replace(
                'cdn.kmc.solutions',
                'kmcstorage1.blob.core.windows.net',
              ),
            },
          }),
      );

      console.log('Surveys inserted!');
    }
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
