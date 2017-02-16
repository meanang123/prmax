<queries>
<query type="SQL"
	format="single"
	dictname="customer"
	defaultsortorder="">
	SELECT c.*,a.* FROM internal.customers AS c JOIN addresses AS a ON a.addressid = c.addressid WHERE c.customerid = %(customerid)s
	</query>
	<query type="SQL"
	format="single"
	dictname="terms"
	defaultsortorder="">
	SELECT c.*,t.* FROM internal.customers AS c JOIN internal.terms as t ON c.termid = t.termid  WHERE  c.customerid = %(customerid)s
	</query>
	<query type="SQL"	format="single" dictname="prmax" defaultsortorder="" >
	SELECT c.* FROM internal.prmaxsettings AS c WHERE c.prmaxsettingsid = 1
	</query>
</queries>
