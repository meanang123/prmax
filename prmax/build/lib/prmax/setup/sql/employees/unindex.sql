CREATE OR REPLACE FUNCTION employees_unindex ( p_employeeid integer )
  RETURNS void
  AS $$

	from prmax.utilities.postgres import PostGresControl
	from prmax.utilities.DBIndexer import StandardIndexer, getOutletFind
	import prmax.Constants as Constants

	controlSettings = PostGresControl(plpy)

	indexer_std_plan = plpy.prepare("INSERT  INTO queues.indexerqueue(action,customerid,objecttype,objectid,data) VALUES($1,$2,$3,$4,$5)", [ "int", "int", "int", "int", "bytea"])

	index_groups = ( ("employeeid",
	( ( Constants.freelance_employeeid,'familyname',StandardIndexer.standardise_string,None),
		( Constants.mp_employeeid,'familyname',StandardIndexer.standardise_string,None),
		( Constants.employee_contact_employeeid,'familyname',StandardIndexer.standardise_string,None),
		( Constants.employee_contactfull_employeeid,'familyname',StandardIndexer.standardise_string,None),
		( Constants.employee_prmaxoutlettypeid,'prmax_outlettypeid',None,None),
		( Constants.freelance_employeeid_countryid ,'countryid',None,None),
		( Constants.employee_countryid ,'countryid',None,None)
	  ),),
		("outletid",
		(( Constants.freelance_employee_outletid ,'familyname',StandardIndexer.standardise_string,None),
		 ( Constants.mp_employee_outletid ,'familyname',StandardIndexer.standardise_string,None),
		 ( Constants.employee_contact_outletid ,'familyname',StandardIndexer.standardise_string,None),
		 ( Constants.employee_outletid_countryid ,'countryid',None,None),
		 ),)
	)
	command = "SELECT e.customerid,c.familyname,o.countryid,e.outletid,o.prmax_outlettypeid,e.employeeid FROM employees AS e JOIN outlets AS o on e.outletid = o.outletid LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid WHERE e.employeeid = %d" % p_employeeid
	employee = plpy.execute(command )[0]

	for index_group in index_groups:
		for item in index_group[1]:
			if item[2]:
				items = [item[2](employee[item[1]]),]
			else:
				items = [ employee[item[1]],]

			for index_item in items:
				plpy.execute(indexer_std_plan, [ 2 ,
							   employee["customerid"],
							   item[0],
							   employee[index_group[0]],
							   index_item])

$$ LANGUAGE plpythonu;
