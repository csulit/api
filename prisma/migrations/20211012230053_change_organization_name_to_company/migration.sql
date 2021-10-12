/*
  Warnings:

  - You are about to drop the column `organization` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "organization",
ADD COLUMN     "company" VARCHAR(100) NOT NULL;
