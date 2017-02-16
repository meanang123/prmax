DROP VIEW ListMember_View;

CREATE VIEW ListMember_View AS SELECT
	lm.listmemberid,
	lm.listid,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	lm.outletid,
	CASE WHEN lm.employeeid IS NULL THEN o.primaryemployeeid ELSE lm.employeeid END as employeeid,
	o.customerid,
	o.outlettypeid,
	CASE WHEN e.customerid=-1 THEN 0 ELSE 1 END as employee_private,
	e.customerid as ecustomerid,
	CASE WHEN oc.primaryemployeeid IS NOT NULL AND (lm.employeeid = oc.primaryemployeeid OR lm.employeeid IS NULL ) THEN true ELSE false END as override_primary,
	c.familyname,
	o.circulation,
	e.job_title,
	pr.prmax_outletgroupid,
	pr.sortorder,
	lm.selected,
	UPPER(o.outletname) as sortname

	FROM userdata.listmembers as lm
		JOIN userdata.list as l ON lm.listid = l.listid
		JOIN outlets as o on o.outletid = lm.outletid
		LEFT OUTER JOIN outletcustomers as oc ON lm.outletid = oc.outletid AND l.customerid = oc.customerid
		JOIN employees as e on COALESCE(lm.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
ORDER BY o.outletname;

GRANT SELECT ON ListMember_View TO prmax;