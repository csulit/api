/*
  Warnings:

  - You are about to drop the column `surveyAnswerId` on the `surveys` table. All the data in the column will be lost.
  - You are about to drop the `survey_answers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `response` to the `surveys` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "surveys" DROP CONSTRAINT "surveys_surveyAnswerId_fkey";

-- AlterTable
ALTER TABLE "surveys" DROP COLUMN "surveyAnswerId",
ADD COLUMN     "response" JSONB NOT NULL;

-- DropTable
DROP TABLE "survey_answers";
