update internal.prmaxcontrol set search_index_rebuild_mode = 1,debug_postgres_python=0;

DELETE FROM userdata.setindex WHERE prmaxdatasetid = 1 AND customerid = -1;

update outlets set force_index = now() WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1);
update employees set force_index = now() WHERE outletid in (SELECT outletid FROM outlets WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1));
update contacts set force_index = now() WHERE contactid IN (SELECT contactid FROM employees WHERE outletid in (SELECT outletid FROM outlets WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1)));
update outletinterests set force_index = now() WHERE outletid in (SELECT outletid FROM outlets WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1));
update employeeinterests set force_index = now() WHERE employeeid IN (SELECT employeeid FROM employees WHERE outletid in (SELECT outletid FROM outlets WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1)));
update outletcoverage set force_index = now() WHERE outletid in (SELECT outletid FROM outlets WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1));
update employeeprmaxroles set force_index = now() WHERE employeeid IN (SELECT employeeid FROM employees WHERE outletid in (SELECT outletid FROM outlets WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1)));
update advancefeatures set force_index = now() WHERE outletid in (SELECT outletid FROM outlets WHERE customerid = -1 AND countryid in ( select countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid = 1));

update internal.prmaxcontrol set search_index_rebuild_mode = 0;

