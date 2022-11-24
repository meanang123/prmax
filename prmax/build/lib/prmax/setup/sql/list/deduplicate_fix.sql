CREATE OR REPLACE FUNCTION standing_deduplicate()
  RETURNS VOID
  AS $$
DECLARE
row RECORD;
p_listmemberid INTEGER;
BEGIN
	FOR row IN SELECT lm.listid,lm.outletid,COUNT(*) from userdata.listmembers as lm JOIN userdata.list AS l ON l.listid = lm.listid WHERE lm.employeeid IS NULL AND listtypeid = 1 GROUP BY lm.listid,lm.outletid HAVING COUNT(*) > 1 LOOP
		SELECT listmemberid INTO p_listmemberid FROM userdata.listmembers WHERE listid = row.listid AND outletid = row.outletid AND employeeid IS NULL LIMIT 1;
		DELETE FROM userdata.listmembers WHERE listid = row.listid AND outletid = row.outletid AND employeeid IS NULL AND listmemberid != p_listmemberid;
	END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION list_remove_deduplicate(p_listid integer )
  RETURNS VOID
  AS $$
DECLARE
row RECORD;
p_listmemberid INTEGER;
BEGIN
	-- delete duplicate primary contacts
	FOR row IN SELECT lm.listid,lm.outletid,COUNT(*) from userdata.listmembers as lm WHERE lm.employeeid IS NULL AND ml.listid = p_listid GROUP BY lm.listid,lm.outletid HAVING COUNT(*) > 1 LOOP
		SELECT listmemberid INTO p_listmemberid FROM userdata.listmembers WHERE listid = row.listid AND outletid = row.outletid AND employeeid IS NULL LIMIT 1;
		DELETE FROM userdata.listmembers WHERE listid = row.listid AND outletid = row.outletid AND employeeid IS NULL AND listmemberid != p_listmemberid;
	END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;