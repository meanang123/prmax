DROP FUNCTION IF EXISTS sessioncount(p_searchtypeid integer, p_userid integer);

CREATE OR REPLACE FUNCTION sessioncount(p_searchtypeid integer, p_userid integer)
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
DECLARE
	firstrow userdata.searchsession%ROWTYPE;
	outletrow outlets%ROWTYPE;
	employeerow employees%ROWTYPE;
	contactrow contacts%ROWTYPE;
	p_employeeid bigint;
	p_contactname text;
	p_listid integer;
	p_listname text;
BEGIN

	p_contactname:= '';

	SELECT INTO firstrow * FROM userdata.searchsession  as s join outlets as o on o.outletid=s.outletid LEFT OUTER JOIN internal.prmax_outlettypes AS ot ON ot. prmax_outlettypeid  = o.prmax_outlettypeid WHERE s.searchtypeid = p_searchtypeid AND s.userid = p_userid ORDER BY  ot.sortorder, o.outletname LIMIT 1;

	SELECT INTO outletrow * FROM outlets WHERE outletid = firstrow.outletid;

	p_employeeid:=firstrow.employeeid;
	IF (p_employeeid IS NULL) THEN
		p_employeeid:=outletrow.primaryemployeeid;
	END IF;

	SELECT INTO employeerow * FROM employees WHERE employeeid = p_employeeid;

	if (employeerow.contactid IS NOT NULL) THEN
		SELECT INTO p_contactname JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname FROM contacts as c WHERE c.contactid = employeerow.contactid;
	END IF;

	SELECT INTO p_listid listid FROM internal.user_session WHERE userid = p_userid;
	SELECT INTO p_listname l.listname FROM internal.user_session AS us LEFT OUTER JOIN userdata.list AS l ON us.listid = l.listid WHERE us.userid = p_userid;


RETURN QUERY SELECT
	COUNT(*) as total,
	IFNULL(SUM(CASE WHEN appended=true THEN 1 ELSE 0 END),0) as appended,
	IFNULL(SUM(CASE WHEN selected=true THEN 1 ELSE 0 END),0) as selected,
	firstrow.outletid::bigint as outletid,
	p_employeeid as employeeid,
	outletrow.outlettypeid as outlettypeid,
	outletrow.customerid as customerid,
	employeerow.customerid as ecustomerid,
	outletrow.outletname::text as outletname,
	p_contactname::text as contactname,
	firstrow.sessionsearchid,
	p_listid::integer as listid,
	p_listname::text as listname

	FROM userdata.searchsession as uss
	WHERE uss.userid = p_userid and searchtypeid = p_searchtypeid ;
END;
$$ LANGUAGE plpgsql VOLATILE;