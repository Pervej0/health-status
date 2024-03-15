/*
  Warnings:

  - The values [active,deactive] on the enum `userStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "userStatus_new" AS ENUM ('ACTIVE', 'DEACTIVE');
ALTER TABLE "users" ALTER COLUMN "status" TYPE "userStatus_new" USING ("status"::text::"userStatus_new");
ALTER TYPE "userStatus" RENAME TO "userStatus_old";
ALTER TYPE "userStatus_new" RENAME TO "userStatus";
DROP TYPE "userStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
