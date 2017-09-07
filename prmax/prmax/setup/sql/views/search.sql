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
	country.countryname,
	o.profile_link_field as displaylink

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




DROP VIEW Search_Results_View_Report;

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
	get_override(ec_c.twitter,e_c.twitter,oc_oc.twitter,o_c.twitter) AS twitter,
	get_override(ec_c.facebook,e_c.facebook,oc_oc.facebook,o_c.facebook) AS facebook,
	get_override(ec_c.linkedin,e_c.linkedin,oc_oc.linkedin,o_c.linkedin) AS linkedin,
	get_override(ec_c.instagram,e_c.instagram,oc_oc.instagram,o_c.instagram) AS instagram,
	country.countryname,
	o.profile_link_field as displaylink
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
		LEFT OUTER JOIN internal.countries as country ON country.countryid = o.countryid

ORDER BY o.outletname;

GRANT SELECT ON Search_Results_View_Report TO prmax;

