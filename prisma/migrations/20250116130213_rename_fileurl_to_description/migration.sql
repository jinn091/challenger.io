/*
  Warnings:

  - You are about to drop the column `fileURL` on the `ChallengeSubmission` table. All the data in the column will be lost.
  - Added the required column `description` to the `ChallengeSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChallengeSubmission" DROP COLUMN "fileURL",
ADD COLUMN     "description" TEXT NOT NULL;
