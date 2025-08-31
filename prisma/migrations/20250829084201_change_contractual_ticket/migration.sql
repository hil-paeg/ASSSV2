/*
  Warnings:

  - Added the required column `site_visit_date` to the `ContractualTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `site_visit_frequency` to the `ContractualTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ContractualTicket" ADD COLUMN     "site_visit_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "site_visit_frequency" INTEGER NOT NULL;
