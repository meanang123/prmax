CREATE TYPE monthly_highest_bounces AS (
	outletid integer,
	outletname varchar,
	nbr bigint
);


CREATE OR REPLACE FUNCTION monthly_highest_bounces(
from_date date,
to_date date
)
  RETURNS SETOF monthly_highest_bounces
  AS $$
BEGIN

RETURN QUERY SELECT
o.outletid,o.outletname,COUNT(*) AS nbr
FROM research.bounceddistribution AS b
LEFT OUTER JOIN userdata.listmemberdistribution as lmd ON lmd.listmemberdistributionid = b.listmemberdistributionid
LEFT OUTER JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid
LEFT OUTER JOIN outlets AS o ON lm.outletid = o.outletid
WHERE created::date between from_date AND to_date AND b.listmemberdistributionid IS NOT NULL
AND o.customerid = -1
AND b.isautomated = false
GROUP BY o.outletid,o.outletname
ORDER BY nbr DESC;
END;
$$ LANGUAGE plpgsql;
