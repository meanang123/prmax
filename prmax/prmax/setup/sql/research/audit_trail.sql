CREATE OR REPLACE FUNCTION audit_trail( fromdate date , todate date)
RETURNS SETOF RECORD as
$BODY$
BEGIN

    RETURN QUERY SELECT
		to_char(a.activitydate,'DD-MM-YY HH24:MI:SS') as activitydate,
		o.actiontypedescription,
		rc.reasoncodedescription,
		a.reason,
		u.display_name,
		COALESCE(aoutlet.outletname,mo.outletname,po.outletname,eoutlet.outletname) as outletname,
		COALESCE(eo.job_title,peo.job_title) as job_title,
		ContactName(co.prefix,co.firstname,co.middlename,co.familyname,co.suffix) as contactname,
		ob.objecttypename,
		f.fieldname,
		audit_to_string(f.fieldid, fromvalue) as fromvalue,
		audit_to_string(f.fieldid, tovalue) as tovalue

		FROM research.activity AS a
		JOIN tg_user AS u ON a.userid = u.user_id
		LEFT OUTER JOIN internal.actiontypes AS o ON o.actiontypeid = a.actiontypeid
		LEFT OUTER JOIN internal.reasoncodes AS rc ON rc.reasoncodeid = a.reasoncodeid
		LEFT OUTER JOIN internal.objecttypes AS ob ON a.objecttypeid = ob.objecttypeid
		LEFT OUTER JOIN research.activitydetails AS sd ON a.activityid = sd.activityid
		LEFT OUTER JOIN research.fields AS f ON f.fieldid = sd.fieldid
		LEFT OUTER JOIN outlets  AS mo ON mo.outletid = a.objectid AND a.objecttypeid IN (1,4)
		LEFT OUTER JOIN employees AS eo ON eo.employeeid = a.objectid AND a.objecttypeid = 2
		LEFT OUTER JOIN contacts AS co ON co.contactid = a.objectid AND a.objecttypeid = 5
		LEFT OUTER JOIN outlets  AS po ON po.outletid = a.parentobjectid AND a.objecttypeid IN (1,4)
		LEFT OUTER JOIN employees  AS peo ON peo.employeeid = a.parentobjectid AND a.parentobjecttypeid =2
		LEFT OUTER JOIN outlets AS eoutlet ON eo.outletid = eoutlet.outletid AND a.objecttypeid = 2
		LEFT OUTER JOIN contacts AS econtact ON eo.contactid = econtact.contactid AND a.objecttypeid = 2
		LEFT OUTER JOIN advancefeatures AS af ON af.advancefeatureid = a.objectid AND a.objecttypeid = 7
		LEFT OUTER JOIN outlets AS aoutlet ON aoutlet.outletid = af.outletid

WHERE a.activitydate BETWEEN $1 AND $2
ORDER BY a.activitydate;
END;
$BODY$ language plpgsql;
