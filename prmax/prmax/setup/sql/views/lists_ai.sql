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
