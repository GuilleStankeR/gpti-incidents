ALTER TABLE "incident" ADD COLUMN "suggested_category_code" TEXT;

ALTER TABLE "incident" ADD CONSTRAINT "incident_suggested_category_code_fkey" FOREIGN KEY ("suggested_category_code") REFERENCES "category"("code") ON DELETE SET NULL ON UPDATE CASCADE;
