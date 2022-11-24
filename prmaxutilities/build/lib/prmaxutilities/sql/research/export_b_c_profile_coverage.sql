SELECT outletid,outletname,profile FROM outlets AS o 
JOIN internal.prmax_outlettypes as ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
WHERE ot.prmax_outletgroupid = 'business';
SELECT outletid,outletname,profile FROM outlets AS o 
JOIN internal.prmax_outlettypes as ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
WHERE ot.prmax_outletgroupid = 'consumer';

SELECT o.outletid,o.outletname,g.geographicalname FROM outletcoverage AS oc
JOIN outlets AS o ON o.outletid = oc.outletid
JOIN internal.prmax_outlettypes as ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
JOIN internal.geographical as g on oc.geographicalid = g.geographicalid
WHERE ot.prmax_outletgroupid = 'consumer'
ORDER BY o.outletid, geographicalname;

SELECT o.outletid,o.outletname,g.geographicalname FROM outletcoverage AS oc
JOIN outlets AS o ON o.outletid = oc.outletid
JOIN internal.prmax_outlettypes as ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
JOIN internal.geographical as g on oc.geographicalid = g.geographicalid
WHERE ot.prmax_outletgroupid = 'business'
ORDER BY o.outletid, geographicalname;



