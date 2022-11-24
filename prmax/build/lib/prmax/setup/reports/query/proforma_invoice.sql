<queries>
<query type="SQL"
	format="single"
	dictname="customer"
	defaultsortorder="">
	SELECT c.*,a.* FROM internal.customers AS c JOIN addresses AS a ON a.addressid = c.addressid WHERE c.customerid = %(customerid)s
	</query>
</queries>
