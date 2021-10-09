/*
  Warnings:

  - You are about to drop the column `floor` on the `visitors` table. All the data in the column will be lost.
  - You are about to drop the column `site` on the `visitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "visitors" DROP COLUMN "floor",
DROP COLUMN "site",
ADD COLUMN     "location" JSONB[];
