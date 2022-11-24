update internal.prmaxcontrol set search_index_rebuild_mode = 1;
delete  from userdata.setindex where keytypeid in (14,15,16,17,25,51) and customerid = -1 and prmaxdatasetid = 1;
update outlets set force_index = now() WHERE countryid in (1,3) and customerid = -1 and prmax_outlettypeid = 42;
update employees
set force_index = now()
FROM outlets
WHERE employees.outletid = outlets.outletid AND outlets.countryid in (1,3) AND outlets.customerid = -1 and outlets.prmax_outlettypeid = 42;
update  employeeinterests
set force_index = now()
FROM employees,outlets
WHERE employees.employeeid = employeeinterests.employeeid AND
employees.outletid = outlets.outletid AND outlets.countryid in (1,3) AND outlets.customerid = -1 and outlets.prmax_outlettypeid = 42;
update  employeeinterests
set force_index = now()
FROM employees,outlets
WHERE employees.employeeid = employeeinterests.employeeid AND
employees.outletid = outlets.outletid AND outlets.prmax_outlettypeid = 42;

update internal.prmaxcontrol set search_index_rebuild_mode = 0;
