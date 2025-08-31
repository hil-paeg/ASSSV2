-- CreateTable
CREATE TABLE "public"."Client" (
    "client_id" INTEGER NOT NULL,
    "client_username" TEXT NOT NULL,
    "client_password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "payment_cycle" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("client_id")
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
    "member_username" TEXT NOT NULL,
    "member_password" TEXT NOT NULL,

    CONSTRAINT "ClientMember_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "public"."ContractualTicket" (
    "contract_id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "allowed_tickets" INTEGER NOT NULL,
    "total_tickets_used" INTEGER NOT NULL DEFAULT 0,
    "ticket_typeRS1" INTEGER NOT NULL,
    "ticket_typeRS1_used" INTEGER NOT NULL DEFAULT 0,
    "ticket_typeRS2" INTEGER NOT NULL,
    "ticket_typeRS2_used" INTEGER NOT NULL DEFAULT 0,
    "ticket_typeRS3_1" INTEGER NOT NULL,
    "ticket_typeRS3_1_used" INTEGER NOT NULL DEFAULT 0,
    "ticket_typeRS3_2" INTEGER NOT NULL,
    "ticket_typeRS3_2_used" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ContractualTicket_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "ticket_id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "issue_title" TEXT NOT NULL,
    "priority" TEXT,
    "description" TEXT,
    "location" TEXT,
    "actions_performed" TEXT,
    "attachments" TEXT,
    "creator_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "comments" TEXT,
    "ticket_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "closed_at" TIMESTAMP(3),
    "summary" TEXT,
    "out_of_scope" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "public"."CloseTicket" (
    "close_id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "summary" TEXT,
    "attachment" TEXT,
    "out_of_scope" BOOLEAN NOT NULL DEFAULT false,
    "experience" TEXT,
    "time_saved" INTEGER,
    "rating" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CloseTicket_pkey" PRIMARY KEY ("close_id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "msg_id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "sender_role" TEXT NOT NULL,
    "msg_text" TEXT NOT NULL,
    "attachment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("msg_id")
);

-- CreateIndex
CREATE INDEX "ClientMember_email_idx" ON "public"."ClientMember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientMember_client_id_escalation_level_key" ON "public"."ClientMember"("client_id", "escalation_level");

-- CreateIndex
CREATE UNIQUE INDEX "CloseTicket_ticket_id_key" ON "public"."CloseTicket"("ticket_id");

-- AddForeignKey
ALTER TABLE "public"."ClientMember" ADD CONSTRAINT "ClientMember_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractualTicket" ADD CONSTRAINT "ContractualTicket_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CloseTicket" ADD CONSTRAINT "CloseTicket_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."Ticket"("ticket_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."Ticket"("ticket_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
