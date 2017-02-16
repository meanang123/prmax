CREATE OR REPLACE FUNCTION JSON_ENCODE( data text)
  RETURNS text
  AS $$

  if data==None:
    return ""
  else:
    return data.replace('\\','\\').replace('"','\\"')

$$ LANGUAGE plpythonu;

DROP VIEW Search_Results_View_Standard;

CREATE VIEW Search_Results_View_Standard AS SELECT
	s.sessionsearchid,
	s.selected as selected,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	s.outletid,
	CASE WHEN s.employeeid IS NULL THEN o.primaryemployeeid ELSE s.employeeid END as employeeid,
	o.customerid,
	o.outlettypeid,
	CASE WHEN e.customerid=-1 THEN 0 ELSE 1 END as employee_private,
	s.appended,
	e.customerid as ecustomerid,
	CASE WHEN oc.primaryemployeeid IS NOT NULL AND (s.employeeid = oc.primaryemployeeid OR s.employeeid IS NULL ) THEN true ELSE false END as override_primary,
	s.userid,
	s.searchtypeid,
	c.familyname,
	o.circulation,
	e.job_title,
	pr.prmax_outletgroupid,
	pr.sortorder,
	coalesce(e.prmaxstatusid,1) AS prmaxstatusid,
	UPPER(o.outletname) as sortname,
	get_override(ec_c.email,e_c.email,oc_oc.email,o_c.email) as email,
	country.countryname

	FROM userdata.searchsession as s
		JOIN outlets as o on o.outletid = s.outletid
		LEFT OUTER JOIN outletcustomers as oc ON s.outletid = oc.outletid AND s.customerid = oc.customerid
		JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid) = e.employeeid
		JOIN tg_user as u on s.userid = u.user_id
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
		-- outlet communications
		LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid) AND ec.customerid = s.customerid
		LEFT OUTER JOIN communications as o_c ON o_c.communicationid = o.communicationid
		LEFT OUTER JOIN communications as oc_oc ON oc_oc.communicationid = oc.communicationid
		LEFT OUTER JOIN communications as e_c ON e_c.communicationid = e.communicationid
		LEFT OUTER JOIN communications as ec_c ON ec_c.communicationid = ec.communicationid
		LEFT OUTER JOIN internal.countries AS country ON country.countryid = COALESCE(o.nationid,o.countryid)

ORDER BY o.outletname;


GRANT SELECT ON Search_Results_View_Standard TO prmax;

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

DROP VIEW ListMember_Ai_View;

CREATE VIEW ListMember_Ai_View AS SELECT
	lm.listid,
	lm.outletid,
	CASE WHEN lm.employeeid IS NULL THEN o.primaryemployeeid ELSE lm.employeeid END as employeeid,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	COALESCE(o.circulation,0) AS circulation,
	o.frequencyid,
	a.address1,
	a.address2,
	a.townname,
	a.county,
	a.postcode,
	comm.email AS outlet_email,
	comm.tel AS outlet_tel,
	comm.fax,
	o.prmax_outlettypeid AS outlettypeid,
	e.job_title,
	JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	get_override(ecomm.email,comm.email,'','') AS contact_email,
	ecomm.tel AS contact_tel,
	o.www,
	get_override(ecomm.twitter,comm.twitter,'','') AS contact_twitter,
	get_override(ecomm.facebook,comm.facebook,'','') AS contact_facebook,
	get_override(ecomm.linkedin,comm.linkedin,'','') AS contact_linkedin,
	o.profile

FROM userdata.listmembers AS lm
JOIN userdata.list AS l ON lm.listid = l.listid
JOIN outlets as o ON o.outletid = lm.outletid
JOIN communications AS comm ON comm.communicationid = o.communicationid
JOIN addresses AS a ON a.addressid = comm.addressid
JOIN employees AS e ON COALESCE(lm.employeeid,o.primaryemployeeid)= e.employeeid
LEFT OUTER JOIN communications AS ecomm ON ecomm.communicationid = e.communicationid
LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
ORDER BY o.outletname;

GRANT SELECT ON ListMember_Ai_View TO prapi;

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
