CREATE OR REPLACE FUNCTION clear_prmax_locks()
  RETURNS VOID
  AS $$
DECLARE
BEGIN

	TRUNCATE internal.lockedobjects;
	PERFORM SETVAL('internal.lockedobjects_lockedobjectid_seq', 1);

END;
$$ LANGUAGE plpgsql;
