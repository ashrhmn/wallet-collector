/*
  Warnings:

  - A unique constraint covering the columns `[address,projectId]` on the table `wallet_addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "wallet_addresses" ADD COLUMN     "addedByUserId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "wallet_addresses_address_projectId_key" ON "wallet_addresses"("address", "projectId");

-- AddForeignKey
ALTER TABLE "wallet_addresses" ADD CONSTRAINT "wallet_addresses_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
