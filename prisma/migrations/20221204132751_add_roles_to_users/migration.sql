-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" "ROLE"[];
