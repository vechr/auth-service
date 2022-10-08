-- AlterEnum
ALTER TYPE "PermissionType" ADD VALUE 'Security';

-- AlterTable
ALTER TABLE "permissions" ALTER COLUMN "permissionType" DROP NOT NULL;
