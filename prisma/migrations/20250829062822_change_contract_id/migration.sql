/*
  Warnings:

  - The primary key for the `ContractualTicket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contract_id` on the `ContractualTicket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ContractualTicket" DROP CONSTRAINT "ContractualTicket_pkey",
DROP COLUMN "contract_id",
ADD CONSTRAINT "ContractualTicket_pkey" PRIMARY KEY ("client_id");
