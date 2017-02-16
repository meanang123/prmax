-- DROP FUNCTION monthly_top_50_breakdown(from_date date, to_date date);
-- DROP TYPE monthly_top_50_breakdown;

CREATE TYPE monthly_top_50_breakdown AS (
	outletid integer,
	outletname varchar,
	emailaddress varchar,
	outlettypename varchar,
	customername varchar,
	nbr bigint,
	last_date date
);


CREATE OR REPLACE FUNCTION monthly_top_50_breakdown(
from_date date,
to_date date
)
  RETURNS SETOF monthly_top_50_breakdown
  AS $$
BEGIN

DROP TABLE IF EXISTS _Temp;
CREATE Temporary Table _Temp AS SELECT
o.outletid,o.outletname,COUNT(*) AS nbr
FROM research.bounceddistribution AS b
LEFT OUTER JOIN userdata.listmemberdistribution as lmd ON lmd.listmemberdistributionid = b.listmemberdistributionid
LEFT OUTER JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid
LEFT OUTER JOIN outlets AS o ON lm.outletid = o.outletid
WHERE b.created::date between from_date AND to_date AND b.listmemberdistributionid IS NOT NULL
AND o.customerid = -1
AND b.isautomated = false
GROUP BY o.outletid,o.outletname
ORDER BY nbr DESC;

RETURN QUERY SELECT
o.outletid,o.outletname,lmd.emailaddress,pt.prmax_outlettypename,c.customername,COUNT(*) AS nbr,MAX(b.created::date) as last_date
FROM research.bounceddistribution AS b
LEFT OUTER JOIN userdata.listmemberdistribution as lmd ON lmd.listmemberdistributionid = b.listmemberdistributionid
LEFT OUTER JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid
LEFT OUTER JOIN outlets AS o ON lm.outletid = o.outletid
LEFT OUTER JOIN employees AS e ON e.employeeid = lm.employeeid
LEFT OUTER JOIN internal.prmax_outlettypes AS pt ON pt.prmax_outlettypeid = o.prmax_outlettypeid
LEFT OUTER JOIN userdata.list AS l ON l.listid = lmd.listid
LEFT OUTER JOIN internal.customers AS c ON l.customerid = c.customerid
WHERE b.created::date between from_date AND to_date AND b.listmemberdistributionid IS NOT NULL
AND o.outletid in (SELECT outletid FROM _Temp ORDER BY nbr DESC limit 50)
AND b.isautomated = false
GROUP BY o.outletid,o.outletname,lmd.emailaddress,pt.prmax_outlettypename,c.customername
ORDER BY o.outletname,nbr DESC;
END;
$$ LANGUAGE plpgsql;
