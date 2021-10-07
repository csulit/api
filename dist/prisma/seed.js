"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
async function seed() {
    const transaction = await prismaClient.$transaction([]);
    return transaction;
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