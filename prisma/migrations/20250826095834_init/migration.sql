-- CreateTable
CREATE TABLE "public"."ClientInfo" (
    "client_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "payment_cycle" TEXT,
    "allowed_tickets" INTEGER,
    "total_tickets_used" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClientInfo_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "public"."ClientMember" (
    "member_id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "member_name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "escalation_level" INTEGER NOT NULL,

    CONSTRAINT "ClientMember_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "ticket_id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "issue_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateIndex
CREATE INDEX "ClientMember_email_idx" ON "public"."ClientMember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientMember_client_id_escalation_level_key" ON "public"."ClientMember"("client_id", "escalation_level");

-- AddForeignKey
ALTER TABLE "public"."ClientMember" ADD CONSTRAINT "ClientMember_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."ClientInfo"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."ClientInfo"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
