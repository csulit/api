/*
  Warnings:

  - You are about to drop the column `surveyId` on the `survey_answers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "survey_answers" DROP CONSTRAINT "survey_answers_surveyId_fkey";

-- AlterTable
ALTER TABLE "survey_answers" DROP COLUMN "surveyId";

-- AlterTable
ALTER TABLE "surveys" ADD COLUMN     "surveyAnswerId" TEXT;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_surveyAnswerId_fkey" FOREIGN KEY ("surveyAnswerId") REFERENCES "survey_answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
