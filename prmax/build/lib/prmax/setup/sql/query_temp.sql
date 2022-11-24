DROP VIEW Search_Results_View_Report_Outlet;
CREATE VIEW Search_Results_View_Report_Outlet AS SELECT
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
	coalesce(CASE WHEN oca.address1 IS NULL THEN oa.address1 ELSE oca.address1 END ) as address1,
	coalesce(CASE WHEN oca.address2 IS NULL THEN oa.address1 ELSE oca.address2 END ) as address2,
	coalesce(CASE WHEN oca.townname IS NULL THEN oa.townname ELSE oca.townname END ) as townname,
	coalesce(CASE WHEN oca.county IS NULL THEN oa.county ELSE oca.county END ) as county,
	coalesce(CASE WHEN oca.postcode IS NULL THEN oa.postcode ELSE oca.postcode END ) as postcode,
	get_override(oc_oc.tel,o_c.tel,'','') as tel,
	get_override(oc_oc.email,o_c.email,'','') as email,
	e.job_title,
	pr.sortorder,
	coalesce(e.prmaxstatusid,1) AS prmaxstatusid,
	UPPER(o.outletname) as sortname,
	pr.prmax_outlettypename,
	o.circulation,
	country.countryname
	FROM userdata.searchsession as s
	JOIN outlets as o on o.outletid = s.outletid
	LEFT OUTER JOIN outletcustomers as oc ON s.outletid = oc.outletid AND s.customerid = oc.customerid
	JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
	JOIN tg_user as u on s.userid = u.user_id
	LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid) AND ec.customerid = s.customerid
	LEFT OUTER JOIN communications as o_c ON o_c.communicationid = o.communicationid
	LEFT OUTER JOIN communications as oc_oc ON oc_oc.communicationid = oc.communicationid
	LEFT OUTER JOIN addresses as oa ON oa.addressid = o_c.addressid
	LEFT OUTER JOIN addresses as oca ON oca.addressid = oc_oc.addressid
	LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
	LEFT OUTER JOIN internal.countries AS country ON country.countryid = COALESCE(o.nationid,o.countryid)
ORDER BY o.outletname;
GRANT SELECT ON Search_Results_View_Report_Outlet TO prmax;

update internal.reporttemplates set query_text= '<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Contact Name,Outlet Name,Address 1,Address 2,Town,County,Postcode,Telephone,email,Job Title,Firstname,Surname,Title,Suffix,Profile,Circulation,Frequency,Media Channel,Country">SELECT s.contactname,s.outletname,s.address1,s.address2,s.townname,s.county,s.postcode,s.tel,s.email,s.job_title,s.firstname,s.familyname,s.prefix,s.suffix,o.profile, o.circulation,COALESCE(freq.frequencyname,'''') AS frequencyname,prmax_outlettypename,countryname  FROM Search_Results_View_Report_Outlet as s JOIN outlets AS o ON o.outletid = s.outletid LEFT OUTER JOIN internal.frequencies as freq ON freq.frequencyid = o.frequencyid WHERE s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND SELECTION(s.selected, %(selector)s)=true ORDER BY outletname </query></queries>' WHERE reporttemplateid = 4;
update internal.reporttemplates set query_text= '<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Contact Name,Outlet Name,Address 1,Address 2,Town,County,Postcode,Telephone,Email,Job Title,Firstname,Surname,Title,Suffix,Country">SELECT JSON_ENCODE(contactname) AS contactname, JSON_ENCODE(outletname) AS outletname, address1, address2, townname, county, postcode, tel, email, job_title, firstname, familyname, prefix, suffix, countryname FROM Search_Results_View_Report AS s WHERE  s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND   SELECTION(s.selected, %(selector)s)=true ORDER BY  outletname </query></queries>' WHERE reporttemplateid = 5;
