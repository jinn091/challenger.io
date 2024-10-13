/*
  Warnings:

  - The values [TEACHER,STUDENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `SessionToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `profileImage` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "SessionToken" DROP CONSTRAINT "SessionToken_pkey",
ALTER COLUMN "token" SET DATA TYPE TEXT,
ADD CONSTRAINT "SessionToken_pkey" PRIMARY KEY ("token");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT NOT NULL;
