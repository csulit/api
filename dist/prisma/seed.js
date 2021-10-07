"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const client_1 = require("@prisma/client");
const survey_1 = require("./data/survey");
const prismaClient = new client_1.PrismaClient();
async function seed() {
    await prismaClient.$transaction(async (prisma) => {
        const surveys = await prisma.survey.count();
        if (!surveys) {
            await prisma.survey.createMany({ data: survey_1.default });
            console.log('Surveys inserted!');
        }
    });
    return 'Done! ';
}
exports.seed = seed;
seed()
    .then((result) => console.log(result))
    .catch((error) => {
    console.log(error);
    process.exit(1);
})
    .finally(async () => await prismaClient.$disconnect());
//# sourceMappingURL=seed.js.map