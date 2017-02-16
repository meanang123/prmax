<queries>
	<query type="SQL"
	format="multiple"
	dictname="lists"
	defaultsortorder="publicationdate_date">
	SELECT * FROM advancefeatureslistresultview WHERE advancefeatureslistid  = %(advancefeatureslistid)s
	ORDER BY publicationdate_date
	</query>
</queries>