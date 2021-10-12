/*
  Warnings:

  - The `survey` column on the `visitors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "survey",
ADD COLUMN     "survey" JSONB[];
