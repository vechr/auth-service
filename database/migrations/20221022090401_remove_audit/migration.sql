/*
  Warnings:

  - You are about to drop the `audits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "audits" DROP CONSTRAINT "audits_userId_fkey";

-- DropTable
DROP TABLE "audits";
