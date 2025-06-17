/*
  Warnings:

  - You are about to drop the column `description` on the `User` table. All the data in the column will be lost.
  - Added the required column `jobDescription` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobRole` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumeScore` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumeSummary` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "jobRole" TEXT NOT NULL,
ADD COLUMN     "resumeScore" INTEGER NOT NULL,
ADD COLUMN     "resumeSummary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "description";
