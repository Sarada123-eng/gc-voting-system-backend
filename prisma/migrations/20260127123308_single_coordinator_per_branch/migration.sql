/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Coordinator` table. All the data in the column will be lost.
  - You are about to drop the column `team` on the `Coordinator` table. All the data in the column will be lost.
  - You are about to drop the column `votes` on the `Coordinator` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `team` on the `Student` table. All the data in the column will be lost.
  - Added the required column `branch` to the `Coordinator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coordinator" DROP COLUMN "createdAt",
DROP COLUMN "team",
DROP COLUMN "votes",
ADD COLUMN     "branch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "createdAt",
DROP COLUMN "team";

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "coordinatorId" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_studentId_key" ON "Vote"("studentId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
