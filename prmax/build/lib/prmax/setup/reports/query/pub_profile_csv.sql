<queries>
	<query type="SQL"
	format="list"
	dictname="results"
	defaultsortorder="outletname"
	header="Outlet Name,Profile,Circulation">
	SELECT
	o.outletname,
	o.profile,
	o.circulation
	FROM userdata.searchsession as s
	JOIN outlets as o on o.outletid = s.outletid
	WHERE
			s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND
			SELECTION(s.selected, %(selector)s)=true
	ORDER BY  outletname
	</query>
</queries>

