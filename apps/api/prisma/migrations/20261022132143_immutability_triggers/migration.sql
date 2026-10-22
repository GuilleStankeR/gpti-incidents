CREATE OR REPLACE FUNCTION prevent_modification()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Table % is insert-only', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_entry_insert_only
  BEFORE UPDATE OR DELETE ON audit_entry
  FOR EACH ROW EXECUTE FUNCTION prevent_modification();

CREATE TRIGGER audit_entry_no_truncate
  BEFORE TRUNCATE ON audit_entry
  FOR EACH STATEMENT EXECUTE FUNCTION prevent_modification();

CREATE TRIGGER evidence_insert_only
  BEFORE UPDATE OR DELETE ON evidence
  FOR EACH ROW EXECUTE FUNCTION prevent_modification();

CREATE TRIGGER evidence_no_truncate
  BEFORE TRUNCATE ON evidence
  FOR EACH STATEMENT EXECUTE FUNCTION prevent_modification();
