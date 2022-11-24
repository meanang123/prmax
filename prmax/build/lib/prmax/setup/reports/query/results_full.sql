<queries>
	<query type="SQL"
	format="multiple"
	dictname="results"
	defaultsortorder="outletname">

	SELECT s.*
	FROM
	Search_Results_View_Report as s

	WHERE
			s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND
			SELECTION(s.selected, %(selector)s)=true
	ORDER BY  outletname
	</query>
</queries>

