/*
  Warnings:

  - The `methods` column on the `Challenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "methods",
ADD COLUMN     "methods" TEXT[];

-- DropEnum
DROP TYPE "WebHackingMethod";
