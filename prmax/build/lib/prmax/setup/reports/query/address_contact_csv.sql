<queries>
	<query type="SQL"
	format="list"
	dictname="results"
	defaultsortorder="outletname"
	header="Contact Name,Outlet Name,Address 1, Address 2,Town,County,Postcode,Telephone,Email,Job Title,Firstname,Surname,Title,Suffix">
	SELECT
	JSON(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	JSON(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) ELSE o.outletname END)as outletname,
	CASE WHEN oca.address1 IS NULL THEN oa.address1	ELSE oca.address1 END as address1,
	CASE WHEN oca.address1 IS NULL THEN oa.address2	ELSE oca.address2 END as address2,
	CASE WHEN oca.address1 IS NULL THEN oa.townname	ELSE oca.townname END as townname,
	CASE WHEN oca.address1 IS NULL THEN oa.county	ELSE oca.county END as county,
	CASE WHEN oca.address1 IS NULL THEN oa.postcode	ELSE oca.postcode END as postcode,
	get_override(ec_c.tel,e_c.tel,oc_c.tel,o_c.tel) as tel,
	get_override(ec_c.email,e_c.email,oc_c.email,o_c.email) as email,
	e.job_title,c.firstname,c.familyname,c.prefix,c.suffix

	FROM userdata.searchsession as s
	JOIN outlets as o on o.outletid = s.outletid
	LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid
	JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
	LEFT OUTER JOIN communications as o_c ON o.communicationid = o_c.communicationid
	LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid
	-- employee communications
	LEFT OUTER JOIN communications as e_c ON e_c.communicationid = e.communicationid
	LEFT OUTER JOIN communications as ec_c ON e_c.communicationid = ec_c.communicationid

	LEFT OUTER JOIN addresses as oa ON oa.addressid = o_c.addressid
	LEFT OUTER JOIN addresses as oca ON oca.addressid = oc_c.addressid
	LEFT OUTER JOIN addresses as ea ON ea.addressid = e_c.addressid
	LEFT OUTER JOIN addresses as eca ON eca.addressid = ec_c.addressid

	LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	WHERE
			s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND
			SELECTION(s.selected, %(selector)s)=true
	ORDER BY  outletname
	</query>
</queries>

