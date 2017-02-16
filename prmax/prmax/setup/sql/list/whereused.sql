CREATE OR REPLACE FUNCTION whereused_count( p_employeeid integer, p_customerid integer )
  RETURNS INTEGER
  AS $$
DECLARE
p_count integer;
p_record RECORD;
BEGIN
	p_count := 0;

	FOR p_record IN SELECT COUNT(*) AS count FROM userdata.listmembers AS lm JOIN outlets AS o ON o.outletid = lm.outletid JOIN userdata.list AS l ON l.listid = lm.listid
		WHERE ( ( lm.employeeid = p_employeeid ) OR ( lm.employeeid IS NULL AND o.primaryemployeeid=p_employeeid)) AND l.customerid = p_customerid
		GROUP BY  l.listid, l.listname LOOP
		p_count = p_count + p_record.count;
	END LOOP;
	RETURN p_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;	