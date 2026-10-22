CREATE TYPE "incident_status" AS ENUM ('REPORTED', 'UNDER_REVIEW', 'REJECTED', 'ASSIGNED', 'IN_PROGRESS', 'CLOSED');

CREATE TYPE "role" AS ENUM ('RESIDENT', 'CONCIERGE', 'ADMIN');

CREATE TABLE "condominium" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "condominium_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_account" (
    "id" UUID NOT NULL,
    "condominium_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "role" NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "category" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sla_hours" INTEGER NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("code")
);

CREATE TABLE "incident" (
    "id" UUID NOT NULL,
    "condominium_id" UUID NOT NULL,
    "folio" TEXT NOT NULL,
    "category_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "geocoded_address" TEXT,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL,
    "reported_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" TIMESTAMPTZ(3) NOT NULL,
    "closed_at" TIMESTAMPTZ(3),
    "status" "incident_status" NOT NULL DEFAULT 'REPORTED',
    "reporter_id" UUID NOT NULL,
    "assignee_id" UUID,

    CONSTRAINT "incident_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "evidence" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "storage_path" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "sha256" CHAR(64) NOT NULL,
    "uploaded_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_entry" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "from_status" "incident_status",
    "to_status" "incident_status" NOT NULL,
    "user_id" UUID NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_entry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "folio_counter" (
    "condominium_id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "last_sequence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "folio_counter_pkey" PRIMARY KEY ("condominium_id","year")
);

CREATE UNIQUE INDEX "condominium_code_key" ON "condominium"("code");

CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

CREATE INDEX "user_account_condominium_id_role_idx" ON "user_account"("condominium_id", "role");

CREATE INDEX "incident_condominium_id_status_idx" ON "incident"("condominium_id", "status");

CREATE INDEX "incident_condominium_id_reported_at_idx" ON "incident"("condominium_id", "reported_at");

CREATE UNIQUE INDEX "incident_condominium_id_folio_key" ON "incident"("condominium_id", "folio");

CREATE INDEX "evidence_incident_id_idx" ON "evidence"("incident_id");

CREATE INDEX "audit_entry_incident_id_created_at_idx" ON "audit_entry"("incident_id", "created_at");

ALTER TABLE "user_account" ADD CONSTRAINT "user_account_condominium_id_fkey" FOREIGN KEY ("condominium_id") REFERENCES "condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "incident" ADD CONSTRAINT "incident_condominium_id_fkey" FOREIGN KEY ("condominium_id") REFERENCES "condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "incident" ADD CONSTRAINT "incident_category_code_fkey" FOREIGN KEY ("category_code") REFERENCES "category"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "incident" ADD CONSTRAINT "incident_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "incident" ADD CONSTRAINT "incident_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "user_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "evidence" ADD CONSTRAINT "evidence_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "evidence" ADD CONSTRAINT "evidence_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "audit_entry" ADD CONSTRAINT "audit_entry_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "audit_entry" ADD CONSTRAINT "audit_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "folio_counter" ADD CONSTRAINT "folio_counter_condominium_id_fkey" FOREIGN KEY ("condominium_id") REFERENCES "condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
