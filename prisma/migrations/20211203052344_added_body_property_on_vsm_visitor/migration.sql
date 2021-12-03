/*
  Warnings:

  - Added the required column `body` to the `vms_visitors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vms_visitors" ADD COLUMN     "body" TEXT NOT NULL;
