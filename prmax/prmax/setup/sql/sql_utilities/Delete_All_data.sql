update internal.prmaxcontrol set search_index_disable_change = 1,debug_postgres_python=0;
TRUNCATE userdata.listmembers;
DELETE from outlets;
DELETE from addresses;
DELETE from contacts;
update internal.prmaxcontrol set search_index_disable_change = 0,debug_postgres_python=0;