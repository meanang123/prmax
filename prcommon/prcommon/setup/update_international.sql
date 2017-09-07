DROP VIEW advancelist_view_extended;
DROP VIEW Search_Results_View_Standard;
DROP VIEW Search_Results_View_Report;
DROP VIEW ListMember_View;
DROP VIEW ListMember_Ai_View;
DROP VIEW advancefeatureslistresultview;

ALTER TABLE outlets ALTER COLUMN outletname TYPE character varying(120);

CREATE OR REPLACE VIEW advancelist_view_extended AS
 SELECT afl.advancefeatureslistid, afl.advancefeatureslistmemberid, o.outletname, af.feature, af.publicationdate_date, af.editorial_date, e.job_title, contactname(con.prefix::text, con.firstname::text, con.middlename::text, con.familyname::text, con.suffix::text) AS contactname, upper(o.outletname::text) AS sortname, upper(con.familyname::text) AS sortfamily, af.outletid, topartialdate(af.publicationdate_description::text, af.publicationdate_date, af.publicationdate_partial) AS pub_date_display, topartialdate(af.editorial_description::text, af.editorial_date, af.editorial_partial) AS editorial_date_display, afl.selected, af.advancefeatureid, pr.prmax_outletgroupid, pr.sortorder,
  get_override(ec_c.email,e_c.email,oc_oc.email,o_c.email) as email,
  get_override(ec_c.tel,e_c.tel,oc_oc.tel,o_c.tel) as tel

   FROM userdata.advancefeatureslistmembers afl
   JOIN userdata.advancefeatureslist AS afll ON afll.advancefeatureslistid = afl.advancefeatureslistid
   JOIN advancefeatures af ON af.advancefeatureid = afl.advancefeatureid
   JOIN outlets o ON af.outletid = o.outletid
   LEFT JOIN employees e ON e.employeeid = COALESCE(af.employeeid,o.primaryemployeeid)
   LEFT JOIN contacts con ON e.contactid = con.contactid
   LEFT JOIN internal.prmax_outlettypes pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
   LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = e.employeeid AND ec.customerid = afll.customerid
   LEFT OUTER JOIN outletcustomers as oc ON af.outletid = oc.outletid AND afll.customerid = oc.customerid
   LEFT OUTER JOIN communications as o_c ON o_c.communicationid = o.communicationid
   LEFT OUTER JOIN communications as oc_oc ON oc_oc.communicationid = oc.communicationid
   LEFT OUTER JOIN communications as e_c ON e_c.communicationid = e.communicationid
   LEFT OUTER JOIN communications as ec_c ON ec_c.communicationid = ec.communicationid;

 GRANT SELECT ON advancelist_view_extended TO prmax;
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
	get_override(ec_c.email,e_c.email,oc_oc.email,o_c.email) as email

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

ORDER BY o.outletname;


GRANT SELECT ON Search_Results_View_Standard TO prmax;
CREATE VIEW Search_Results_View_Report  AS SELECT
	s.selected as selected,
	CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END as outletname,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
	CASE WHEN s.employeeid IS NULL THEN o.primaryemployeeid ELSE s.employeeid END as employeeid,
	s.outletid,
	o.customerid,
	s.appended,
	s.userid,
	s.searchtypeid,
	c.familyname,
	c.firstname,
	c.prefix,
	c.suffix,
	-- for addresses
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.address1 ELSE oca.address1 END
	     ELSE ea.address1 END
	ELSE eca.address1 END,'') as address1,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.address2 ELSE oca.address2 END
	     ELSE ea.address2 END
	ELSE eca.address2 END,'') as address2,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.townname ELSE oca.townname END
	     ELSE ea.townname END
	ELSE eca.townname END,'') as townname,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.county ELSE oca.county END
	     ELSE ea.county END
	ELSE eca.county END,'') as county,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.postcode ELSE oca.postcode END
	     ELSE ea.postcode END
	ELSE eca.postcode END,'') as postcode,
	get_override(ec_c.tel,e_c.tel,oc_oc.tel,o_c.tel) as tel,
	get_override(ec_c.email,e_c.email,oc_oc.email,o_c.email) as email,
	e.job_title,
	pr.sortorder,
	coalesce(e.prmaxstatusid,1) AS prmaxstatusid,
	UPPER(o.outletname) as sortname,
	pr.prmax_outlettypename,
	o.circulation,

	FROM userdata.searchsession as s
		JOIN outlets as o on o.outletid = s.outletid
		LEFT OUTER JOIN outletcustomers as oc ON s.outletid = oc.outletid AND s.customerid = oc.customerid
		JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
		JOIN tg_user as u on s.userid = u.user_id
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid) AND ec.customerid = s.customerid

		-- outlet communications
		LEFT OUTER JOIN communications as o_c ON o_c.communicationid = o.communicationid
		-- outlet override
		LEFT OUTER JOIN communications as oc_oc ON oc_oc.communicationid = oc.communicationid
		-- employee communications
		LEFT OUTER JOIN communications as e_c ON e_c.communicationid = e.communicationid
		-- employee override
		LEFT OUTER JOIN communications as ec_c ON ec.communicationid = ec_c.communicationid

		LEFT OUTER JOIN addresses as oa ON oa.addressid = o_c.addressid
		LEFT OUTER JOIN addresses as oca ON oca.addressid = oc_oc.addressid
		LEFT OUTER JOIN addresses as ea ON ea.addressid = e_c.addressid
		LEFT OUTER JOIN addresses as eca ON eca.addressid = ec_c.addressid
		LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid

ORDER BY o.outletname;

GRANT SELECT ON Search_Results_View_Report TO prmax;

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
CREATE VIEW ListMember_Ai_View AS SELECT
	lm.listid,
	lm.outletid,
	CASE WHEN lm.employeeid IS NULL THEN o.primaryemployeeid ELSE lm.employeeid END as employeeid,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	o.circulation,
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
	get_override(ecomm.instagram,comm.instagram,'','') AS contact_instagram,
	o.profile

FROM userdata.listmembers AS lm
JOIN userdata.list AS l ON lm.listid = l.listid
JOIN outlets as o ON o.outletid = lm.outletid
JOIN communications AS comm ON comm.communicationid = o.communicationid
JOIN addresses AS a ON a.addressid = comm.addressid
JOIN employees AS e ON COALESCE(lm.employeeid,o.primaryemployeeid)= e.employeeid
JOIN communications AS ecomm ON ecomm.communicationid = e.communicationid
LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
ORDER BY o.outletname;

GRANT SELECT ON ListMember_Ai_View TO prapi;

CREATE VIEW advancefeatureslistresultview AS
SELECT advancefeatureslistid,advancefeatureslistmemberid,o.outletname,af.feature,publicationdate_date,editorial_date,
e.job_title,
ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
UPPER(o.outletname) AS sortname,
UPPER(con.familyname) AS sortfamily,
af.outletid,
ToPartialDate(af.publicationdate_description,af.publicationdate_date,af.publicationdate_partial) as pub_date_display,
ToPartialDate(af.editorial_description,af.editorial_date,af.editorial_partial) as editorial_date_display,
afl.selected,
af.advancefeatureid,
pr.prmax_outletgroupid,
pr.sortorder

FROM userdata.advancefeatureslistmembers AS afl
JOIN advancefeatures AS af ON af.advancefeatureid = afl.advancefeatureid
JOIN outlets AS o ON af.outletid = o.outletid
LEFT OUTER JOIN employees AS e ON e.employeeid = af.employeeid
LEFT OUTER JOIN contacts AS con ON e.contactid = con.contactid
LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
ORDER BY af.publicationdate_date;

GRANT SELECT ON advancefeatureslistresultview TO prmax;


update internal.reporttemplates set query_text = replace(query_text,'JSON(','JSON_ENCODE(') where query_text like '%JSON%';