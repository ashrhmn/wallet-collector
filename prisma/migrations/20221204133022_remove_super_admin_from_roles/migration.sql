/*
  Warnings:

  - The values [SUPER_ADMIN] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "users" ALTER COLUMN "roles" TYPE "ROLE_new"[] USING ("roles"::text::"ROLE_new"[]);
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "ROLE_old";
COMMIT;
