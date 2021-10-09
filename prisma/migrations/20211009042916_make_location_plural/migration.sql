/*
  Warnings:

  - You are about to drop the column `location` on the `visitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "visitors" DROP COLUMN "location",
ADD COLUMN     "locations" JSONB[];
