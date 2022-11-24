SELECT
o.outletid,
o.outletname,
f.frequencyname,
ot.prmax_outlettypename,
cs.circulationsourcedescription,
0
FROM outlets AS o
LEFT OUTER JOIN internal.frequencies AS f on f.frequencyid = o.frequencyid
LEFT OUTER JOIN internal.prmax_outlettypes AS ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
LEFT OUTER JOIN internal.circulationsource AS cs ON cs.circulationsourceid = o.circulationsourceid
WHERE o.sourcetypeid in (1,2) AND o.customerid = -1 AND
o.outletid NOT IN (
select
o.outletid
FROM userdata.emailtemplates AS e
JOIN userdata.list as l ON e.listid = l.listid
JOIN userdata.listmembers AS lm ON l.listid = lm.listid
JOIN outlets AS o ON lm.outletid = o.outletid
WHERE o.sourcetypeid in (1,2) AND o.customerid = -1 GROUP BY o.outletid )
UNION
SELECT
o.outletid,
o.outletname,
f.frequencyname,
ot.prmax_outlettypename,
cs.circulationsourcedescription,
COUNT(*)
FROM userdata.emailtemplates AS e
JOIN userdata.list as l ON e.listid = l.listid
JOIN userdata.listmembers AS lm ON l.listid = lm.listid
JOIN outlets AS o ON lm.outletid = o.outletid
LEFT OUTER JOIN internal.frequencies AS f on f.frequencyid = o.frequencyid
LEFT OUTER JOIN internal.prmax_outlettypes AS ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
LEFT OUTER JOIN internal.circulationsource AS cs ON cs.circulationsourceid = o.circulationsourceid
WHERE o.sourcetypeid in (1,2) AND o.customerid = -1
GROUP BY o.outletid,o.outletname,f.frequencyname,ot.prmax_outlettypename,cs.circulationsourcedescription;
