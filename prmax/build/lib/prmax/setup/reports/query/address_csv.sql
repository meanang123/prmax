<queries>
	<query type="SQL"
	format="list"
	dictname="results"
	defaultsortorder="outletname"
	header="Contact Name,Outlet Name,Address 1, Address 2,Town,County,Postcode,Telephone,email,Job Title,Firstname,Surname,Title,Suffix">
	SELECT
		s.contactname,
		s.outletname,
		s.address1,
		s.address2,
		s.townname,
		s.county,
		s.postcode,
		s.tel,
		s.email,
		s.job_title,
		s.firstname,s.familyname,s.prefix,s.suffix
	FROM
		Search_Results_View_Report as s
	WHERE
		s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND
		SELECTION(s.selected, %(selector)s)=true
	ORDER BY outletname
	</query>
</queries>

