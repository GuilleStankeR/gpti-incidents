CREATE TABLE "stored_file" (
    "storage_path" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stored_file_pkey" PRIMARY KEY ("storage_path")
);

CREATE OR REPLACE FUNCTION prevent_update()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Table % does not allow updates', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stored_file_no_update
  BEFORE UPDATE ON stored_file
  FOR EACH ROW EXECUTE FUNCTION prevent_update();

CREATE TRIGGER stored_file_no_truncate
  BEFORE TRUNCATE ON stored_file
  FOR EACH STATEMENT EXECUTE FUNCTION prevent_update();
