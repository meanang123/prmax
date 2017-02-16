<queries>
	<query type="SQL"
	format="multiple"
	dictname="lists"
	defaultsortorder="listname">
	SELECT l.listid,l.listname,
				(SELECT COUNT(*) from userdata.listmembers as lm WHERE lm.listid=l.listid) as nbr ,
				list_projects(l.listid) as projects
	FROM userdata.list as l  WHERE l.customerid = %(customerid)s
	ORDER BY listname
	</query>
</queries>
