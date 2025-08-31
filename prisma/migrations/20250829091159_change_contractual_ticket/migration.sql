/*
  Warnings:

  - You are about to drop the column `site_visit_date` on the `ContractualTicket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ContractualTicket" DROP COLUMN "site_visit_date";

-- CreateTable
CREATE TABLE "public"."SiteVisit" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SiteVisit" ADD CONSTRAINT "SiteVisit_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."ContractualTicket"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
