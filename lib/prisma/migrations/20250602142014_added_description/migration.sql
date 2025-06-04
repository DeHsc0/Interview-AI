/*
  Warnings:

  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skils` on the `User` table. All the data in the column will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
DROP COLUMN "skils",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "role" SET NOT NULL;
