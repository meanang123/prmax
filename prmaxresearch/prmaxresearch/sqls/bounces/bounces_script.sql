\o '/tmp/top50breakdown.csv'
DROP TABLE IF EXISTS _Temp;
CREATE Temporary Table _Temp AS SELECT
o.outletid,o.outletname,COUNT(*) AS nbr
FROM research.bounceddistribution AS b
LEFT OUTER JOIN userdata.listmemberdistribution as lmd ON lmd.listmemberdistributionid = b.listmemberdistributionid
LEFT OUTER JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid
LEFT OUTER JOIN outlets AS o ON lm.outletid = o.outletid
WHERE created::date between '2013/01/01' AND '2013/01/31' AND b.listmemberdistributionid IS NOT NULL
AND o.customerid = -1
AND b.isautomated = false
GROUP BY o.outletid,o.outletname
ORDER BY nbr DESC;
SELECT
o.outletname,lmd.emailaddress,COUNT(*) AS nbr
FROM research.bounceddistribution AS b
LEFT OUTER JOIN userdata.listmemberdistribution as lmd ON lmd.listmemberdistributionid = b.listmemberdistributionid
LEFT OUTER JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid
LEFT OUTER JOIN outlets AS o ON lm.outletid = o.outletid
LEFT OUTER JOIN employees AS e ON e.employeeid = lm.employeeid
WHERE created::date between '2013/01/01' AND '2013/01/31' AND b.listmemberdistributionid IS NOT NULL
AND o.outletid in (SELECT outletid FROM _Temp ORDER BY nbr DESC limit 50)
AND b.isautomated = false
GROUP BY o.outletname,lmd.emailaddress
ORDER BY o.outletname,nbr DESC;
\o '/tmp/top50.csv'
SELECT
o.outletid,o.outletname,COUNT(*) AS nbr
FROM research.bounceddistribution AS b
LEFT OUTER JOIN userdata.listmemberdistribution as lmd ON lmd.listmemberdistributionid = b.listmemberdistributionid
LEFT OUTER JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid
LEFT OUTER JOIN outlets AS o ON lm.outletid = o.outletid
WHERE created::date between '2013/01/01' AND '2013/01/31' AND b.listmemberdistributionid IS NOT NULL
AND o.customerid = -1
AND b.isautomated = false
GROUP BY o.outletid,o.outletname
ORDER BY nbr DESC;