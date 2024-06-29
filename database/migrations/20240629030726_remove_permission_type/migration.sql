/*
  Warnings:

  - You are about to drop the column `permissionType` on the `permissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "permissionType";

-- DropEnum
DROP TYPE "PermissionType";
