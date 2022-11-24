COPY ( SELECT
o.outletid,
o.outletname,
ot.prmax_outlettypename,
f.frequencyname,
COUNT(*) AS used_count
FROM outlets AS o
LEFT OUTER JOIN internal.prmax_outlettypes AS ot ON ot.prmax_outlettypeid = o.pr
LEFT OUTER JOIN internal.frequencies AS f ON f.frequencyid = o.frequencyid
JOIN userdata.listmembers AS lm ON lm.outletid = o.outletid
JOIN userdata.list AS l ON l.listid = lm.listid
WHERE o.customerid = -1 AND o.sourcetypeid in (1,2) AND l.listtypeid = 1
GROUP BY o.outletid,
o.outletname,
ot.prmax_outlettypename,
f.frequencyname) to '/tmp/D2.csv' with CSV;
