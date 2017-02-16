<queries>
	<query type="SQL"
	format="list"
	dictname="results"
	defaultsortorder="outletname"
	header="Contact Name,Outlet Name,Job Title">
	SELECT
	JSON(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	JSON(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) ELSE o.outletname END)as outletname,
	e.job_title
	FROM userdata.searchsession as s
	JOIN outlets as o on o.outletid = s.outletid
	LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid
	JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
	LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	WHERE
			s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND
			SELECTION(s.selected, %(selector)s)=true
	ORDER BY  outletname
	</query>
</queries>

