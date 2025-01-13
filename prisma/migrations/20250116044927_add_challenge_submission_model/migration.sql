-- CreateEnum
CREATE TYPE "ChallengeSubmissionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAIL');

-- CreateTable
CREATE TABLE "ChallengeSubmission" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "proofOfExploit" TEXT NOT NULL,
    "status" "ChallengeSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "fileURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
