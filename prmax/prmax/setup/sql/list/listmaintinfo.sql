CREATE OR REPLACE FUNCTION listmaintcount(p_customerid integer, p_userid integer, p_listtypeid integer )
  RETURNS SETOF SearchSessionStatistics
  AS $$
DECLARE
BEGIN

RETURN QUERY SELECT
	COUNT(*) as total,
	0::bigint as appended,
	IFNULL(SUM(CASE WHEN lu.selected=true THEN 1 ELSE 0 END),0) as selected,
	0::bigint,
	0::bigint,
	1,
	1,
	1,
	''::text,
	''::text,
	-1
	FROM userdata.list AS l
	LEFT OUTER JOIN userdata.listusers AS lu ON lu.listid = l.listid AND userid = p_userid
	WHERE  l.customerid = p_customerid AND l.listtypeid = p_listtypeid;
END;
$$ LANGUAGE plpgsql;