update internal.prmaxcontrol set search_index_rebuild_mode = 1,debug_postgres_python=0;

TRUNCATE userdata.setindex;
TRUNCATE queues.indexerqueue;

update outlets set force_index = now();
update employees set force_index = now();
update contacts set force_index = now();

update outletinterests set force_index = now();
update employeeinterests set force_index = now();
update outletcoverage set force_index = now();

update employeeprmaxroles set force_index = now();

update advancefeatures set force_index = now();

update internal.prmaxcontrol set search_index_rebuild_mode = 0;

