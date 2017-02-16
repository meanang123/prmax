DROP FUNCTION IF EXISTS advancecount(p_inadvancefeaturelistid integer);

CREATE OR REPLACE FUNCTION advancecount(p_inadvancefeaturelistid integer)
  RETURNS SETOF SearchSessionStatisticsExt2
  AS $$
DECLARE
	firstrow advancefeatureslistresultview%ROWTYPE;
	outletrow outlets%ROWTYPE;
	employeerow employees%ROWTYPE;
	contactrow contacts%ROWTYPE;
	p_employeeid bigint;
	p_contactname text;
	p_listid integer;
	p_listname text;
	p_typeid integer;
	p_advancefeaturelistid integer;

BEGIN

	p_contactname:= '';
	p_advancefeaturelistid:=p_inadvancefeaturelistid;

	SELECT INTO firstrow * FROM advancefeatureslistresultview AS s JOIN outlets AS o ON o.outletid=s.outletid LEFT OUTER JOIN internal.prmax_outlettypes AS ot ON ot. prmax_outlettypeid  = o.prmax_outlettypeid WHERE s.advancefeatureslistid = p_advancefeaturelistid ORDER BY publicationdate_date, s.sortname , UPPER(SUBSTRING(s.feature,0,10)) LIMIT 1;

	SELECT INTO outletrow * FROM outlets WHERE outletid = firstrow.outletid;

	SELECT  advancefeatureslistdescription INTO p_listname FROM userdata.advancefeatureslist WHERE advancefeatureslistid = p_advancefeaturelistid ;
	SELECT  advancefeatureslisttypeid INTO p_typeid FROM userdata.advancefeatureslist WHERE advancefeatureslistid = p_advancefeaturelistid ;

	p_employeeid:=outletrow.primaryemployeeid;

	SELECT INTO employeerow * FROM employees WHERE employeeid = p_employeeid;

	if (employeerow.contactid IS NOT NULL) THEN
		SELECT INTO p_contactname JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname FROM contacts as c WHERE c.contactid = employeerow.contactid;
	END IF;

	IF p_typeid = 2 THEN
		p_advancefeaturelistid:=-1;
	END IF;

RETURN QUERY SELECT
	COUNT(*) as total,
	0::bigint as appended,
	IFNULL(SUM(CASE WHEN selected=true THEN 1 ELSE 0 END),0) as selected,
	firstrow.outletid::bigint as outletid,
	p_employeeid as employeeid,
	outletrow.outlettypeid as outlettypeid,
	outletrow.customerid as customerid,
	employeerow.customerid as ecustomerid,
	outletrow.outletname::text as outletname,
	p_contactname::text as contactname,
	firstrow.advancefeatureslistmemberid,
	p_advancefeaturelistid as listid,
	p_listname::text as listname,
	firstrow.advancefeatureid as advancefeatureid

	FROM advancefeatureslistresultview AS afl
	WHERE afl.advancefeatureslistid = p_inadvancefeaturelistid;
END;
$$ LANGUAGE plpgsql VOLATILE;