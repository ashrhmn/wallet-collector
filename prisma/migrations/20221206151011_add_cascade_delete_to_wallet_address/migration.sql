-- DropForeignKey
ALTER TABLE "wallet_addresses" DROP CONSTRAINT "wallet_addresses_projectId_fkey";

-- AddForeignKey
ALTER TABLE "wallet_addresses" ADD CONSTRAINT "wallet_addresses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
