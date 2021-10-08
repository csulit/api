/*
  Warnings:

  - Added the required column `floor` to the `visitors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `site` to the `visitors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "floor" VARCHAR(100) NOT NULL,
ADD COLUMN     "site" VARCHAR(100) NOT NULL;
