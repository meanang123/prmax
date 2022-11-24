CREATE OR REPLACE FUNCTION advancelistmaintcount(p_customerid integer, p_userid integer )
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
	FROM userdata.advancefeatureslist as l
	LEFT OUTER JOIN userdata.advancelistusers as lu ON lu.advancefeatureslistid = l.advancefeatureslistid AND lu.userid = p_userid
	WHERE  l.customerid = p_customerid AND advancefeatureslisttypeid = 1;
END;
$$ LANGUAGE plpgsql;