/*
  Warnings:

  - You are about to drop the column `profileId` on the `visitors` table. All the data in the column will be lost.
  - Added the required column `userId` to the `visitors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "visitors" DROP CONSTRAINT "visitors_profileId_fkey";

-- AlterTable
ALTER TABLE "visitors" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
