\c prmax
\a
\t
\o /tmp/audit_log.txt
select
ac.actiontypedescription,
rc.reasoncodedescription,
act.reason,
act.activitydate,
obj.objecttypename,
o.outletname,
op.outletname,
e.job_title,
ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
fd.fieldname,
ad.fromvalue,
ad.tovalue

FROM research.activity as act
LEFT OUTER JOIN outlets as o ON o.outletid = act.objectid AND act.objecttypeid IN (1,4)
LEFT OUTER JOIN employees as e ON e.employeeid = act.objectid AND act.objecttypeid = 2
LEFT OUTER JOIN contacts as con ON con.contactid = act.objectid AND act.objecttypeid IN( 3,5 )
LEFT OUTER JOIN internal.actiontypes as ac ON ac.actiontypeid = act.actiontypeid
LEFT OUTER JOIN outlets as op ON op.outletid = act.parentobjectid AND act.objecttypeid = 2
LEFT OUTER JOIN internal.reasoncodes AS rc ON rc.reasoncodeid = act.reasoncodeid
LEFT OUTER JOIN internal.objecttypes AS obj ON obj.objecttypeid = act.objecttypeid
LEFT OUTER JOIN research.activitydetails AS ad ON ad.activityid = act.activityid
LEFT OUTER JOIN research.fields AS fd ON fd.fieldid = ad.fieldid

WHERE activitydate::date between CURRENT_DATE - interval '32 days' and CURRENT_DATE