/*
  Warnings:

  - Added the required column `leaveType` to the `visitors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workType` to the `visitors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "leaveType" VARCHAR(100) NOT NULL,
ADD COLUMN     "workType" VARCHAR(100) NOT NULL;
