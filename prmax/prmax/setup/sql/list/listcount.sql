CREATE OR REPLACE FUNCTION listcount(p_listid integer)
  RETURNS SETOF SearchSessionStatistics
  AS $$
DECLARE
	firstrow userdata.listmembers%ROWTYPE;
	outletrow outlets%ROWTYPE;
	p_employeeid bigint;
BEGIN

	SELECT INTO firstrow * FROM userdata.listmembers  as s join outlets as o on o.outletid=s.outletid WHERE s.listid = p_listid ORDER BY o.outletname LIMIT 1;
	SELECT INTO outletrow * FROM outlets WHERE outletid = firstrow.outletid;

	p_employeeid:=firstrow.employeeid;
	IF (p_employeeid IS NULL) THEN
		p_employeeid:=outletrow.primaryemployeeid;
	END IF;

RETURN QUERY SELECT
	COUNT(*) as total,
	IFNULL(SUM(CASE WHEN appended=true THEN 1 ELSE 0 END),0) as appended,
	IFNULL(SUM(CASE WHEN selected=true THEN 1 ELSE 0 END),0) as selected,
	firstrow.outletid::bigint as outletid,
	p_employeeid as employeeid,
	outletrow.outlettypeid as outlettypeid,
	-1 as customerid,
	-1 as ecustomerid,
	''::text as outletname,
	''::text as contactname,
	-1 as sessionsearchid
	FROM userdata.listmembers WHERE  listid = p_listid;
END;
$$ LANGUAGE plpgsql;