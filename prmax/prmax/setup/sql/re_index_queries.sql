-- reindex job roles
update internal.prmaxcontrol set search_index_rebuild_mode = 1;
DELETE FROM userdata.setindex where keytypeid in ( 120,119) AND keyname = '1348' AND prmaxdatasetid = 1;
update  employeeprmaxroles
set force_index = now()
FROM employees,outlets
WHERE employees.employeeid = employeeprmaxroles.employeeid AND
employees.outletid = outlets.outletid AND outlets.countryid in (1,3) and prmaxroleid = 1348;
update internal.prmaxcontrol set search_index_rebuild_mode = 0;

-- reindex contact keywords
update internal.prmaxcontrol set search_index_rebuild_mode = 1;
DELETE FROM userdata.setindex where keytypeid in ( 7,8) AND keyname = '1006' AND prmaxdatasetid = 1;
update  employeeinterests
set force_index = now()
FROM employees,outlets
WHERE employees.employeeid = employeeinterests.employeeid AND
employees.outletid = outlets.outletid AND outlets.countryid in (1,3) AND inserestid = 1006;
update internal.prmaxcontrol set search_index_rebuild_mode = 0;

-- select * from userdata.setindex where keyname = '1006' AND keytypeid in ( 7,8);

update internal.prmaxcontrol set search_index_rebuild_mode = 1;
DELETE FROM userdata.setindex where keytypeid in ( 121 ) AND keyname in ('1','6','24') AND prmaxdatasetid = 1;
update employees
set force_index = now()
FROM outlets
WHERE employees.outletid = outlets.outletid AND outlets.countryid in (1,3) AND outlets.prmax_outlettypeid in (1,6,24);
update internal.prmaxcontrol set search_index_rebuild_mode = 0;

update internal.prmaxcontrol set search_index_rebuild_mode = 1;
DELETE FROM userdata.setindex where keytypeid in ( 131 ) AND keyname = '1' AND prmaxdatasetid = 1;
update employees
set force_index = now()
FROM outlets
WHERE employees.outletid = outlets.outletid AND outlets.countryid in (1);
update internal.prmaxcontrol set search_index_rebuild_mode = 0;


-- select employees_unindex(272012);
select employees_unindex(269829);
update employees set outletid = 71186 where employeeid = 269829;
update internal.prmaxcontrol set search_index_rebuild_mode = 1;
update employees set force_index = now() where employeeid = 269829;
update internal.prmaxcontrol set search_index_rebuild_mode = 0;

-- do freelance re-set
update internal.prmaxcontrol set search_index_rebuild_mode = 1;
DELETE FROM userdata.setindex where keytypeid in ( 14,15,16,17,25,51 ) AND prmaxdatasetid = 1;
update employees
set force_index = now()
FROM outlets
WHERE employees.outletid = outlets.outletid AND outlets.countryid in (1) AND outlettypeid = 19;
update outlets
set force_index = now()
WHERE countryid in (1) AND outlettypeid = 19;
update internal.prmaxcontrol set search_index_rebuild_mode = 0;


update internal.prmaxcontrol set search_index_rebuild_mode = 1;
DELETE FROM userdata.setindex where keytypeid in ( 24 ) AND keyname = '1' AND prmaxdatasetid = 1;
update outlets set force_index = now() WHERE countryid in (1);
update internal.prmaxcontrol set search_index_rebuild_mode = 0;

SELECT COUNT(*) from queues.indexerqueue;

-- freelance re-index
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


-- single delete command
INSERT INTO queues.indexerqueue( objecttype, objectid, data, action, customerid ) VALUES(10,254844,'watt',2,-1);
INSERT INTO queues.indexerqueue( objecttype, objectid, data, action, customerid ) VALUES(14,251529,'1029',2,-1);

INSERT INTO queues.indexerqueue( objecttype, objectid, data, action, customerid ) VALUES(7,249084,'1029',2,-1);



update internal.prmaxcontrol set search_index_rebuild_mode = 1;
update outlets set force_index = now() WHERE outletid = 107884;
update internal.prmaxcontrol set search_index_rebuild_mode = 0;
