SELECT outletid,outletname,pr.prmax_outlettypename,f.frequencyname,rc.created_date
FROM outlets AS o 
JOIN internal.prmax_outlettypes AS pr ON o.prmax_outlettypeid = pr.prmax_outlettypeid
JOIN internal.frequencies AS f ON f.frequencyid = o.frequencyid
JOIN internal.research_control_record AS rc ON rc.objectid = o.outletid AND rc.objecttypeid = 1 
where sourcetypeid = 2;