-- This need to be tightned up for ? this doesn't work?
-- GRANT ALL PRIVILEGES ON DATABASE  prmax TO prmax;

 select 'grant all on '||schemaname||'.'||tablename||' to prmax;' from pg_tables where schemaname in ('public', 'internal','accounts','queues','seoreleases','userdata','cache') order by schemaname, tablename;
SELECT 'grant all on function '||n.nspname||'.'||p.proname||'('||oidvectortypes(p.proargtypes)||') to prmax ;' from pg_proc p, pg_namespace n where n.oid = p.pronamespace and n.nspname in ('prmax');
SELECT 'grant UPDATE on SEQUENCE '|| "sequence_name"|| ' to prmax ;' from information_schema.sequences where sequence_catalog='prmax';


GRANT SELECT ON TABLE
internal.prmaxcontrol,
internal.frequencies,
internal.deliverypreferences,
internal.regionalfocus,
internal.currencies,
internal.industries,
internal.languages,
internal.status,
internal.producttypes,
internal.outlettypes,
internal.roles,
internal.geographical,
internal.subjects,
internal.geographicaltree,
internal.geographicallookuptypes,
internal.geographicallookupcascade,
internal.helptree,
internal.labels,
internal.labelrows,
internal.prmaxsettings,
internal.customerstatus,
internal.prmax_outlettypes,
internal.messagetypes
TO prmax;


GRANT INSERT,UPDATE,DELETE,SELECT ON
internal.customers,
internal.reporttemplates,
internal.prmaxcustomerinfo,
internal.prmaxroles,
internal.prmaxrolewords,
internal.demorequests,
internal.prmaxrolesynonyms,
internal.research_control_record
TO PRMAX;

GRANT INSERT,UPDATE,DELETE,SELECT ON
cache.cachestore,
cache.cachestorelist
TO PRMAX;

GRANT INSERT,UPDATE,DELETE,SELECT ON
	addresses,communications,contacts,outlets,employees,
	outletcustomers,employeecustomers,interests,interestwords,interestgroups,
	outletsubjects,employeesubjects,employeeroles,employeelanguages,
	outletlanguages,outletcoverage,interestsubjects,outletinterests,employeeinterests,
	visit, visit_identity, tg_user,outlettitles, employeeprmaxroles
 TO prmax;

 GRANT SELECT ON
 tg_group, user_group
 TO prmax;

GRANT INSERT,UPDATE,DELETE,SELECT ON
 queues.indexerqueue,
 queues.reports,
 queues.cachequeue,
 queues.emailqueue
  TO PRMAX;

GRANT DELETE,SELECT ON
  user_group
TO PRMAX;

GRANT INSERT,UPDATE,DELETE,SELECT ON
 userdata.setindex,
 userdata.list,
 userdata.listmembers,
 userdata.projectmembers,
 userdata.projects,
 userdata.listusers,
 userdata.collateral,
 userdata.emailtemplates,
 userdata.searchsession,
 userdata.collateralinterests,
 userdata.projectcollateral
 TO PRMAX;

GRANT SELECT ON employeeinterest_view,
	outletinterest_view,
	customer_external_view,
	user_external_view,
	outletcustomer_view,
	outletcoverage_view,
	geographical_lookup_view,
	employeerole_view,
	outletcoverage_view
TO prmax;


GRANT UPDATE ON SEQUENCE
	addresses_addressid_seq,
	contact_contactid_seq,
	communications_communicationid_seq,
	outlets_outletid_seq,
	employees_employeeid_seq,
	interest_interestid_seq,
	internal.roles_roleid_seq,
	internal.outlettypes_outlettypeid_seq,
	internal.frequencies_frequencyid_seq,
	internal.deliverypreferences_deliverypreferenceid_seq,
	internal.regionalfocus_regionalfocusid_seq,
	internal.currencies_currencyid_seq,
	internal.industries_industryid_seq,
	internal.languages_languageid_seq,
	internal.status_statusid_seq,
	internal.productypes_producttypeid_seq,
	internal.geographical_geographicalid_seq,
	internal.subjects_subjectid_seq,
	outlet_interest_outletinterestid_seq,
	employeeinterests_employeeinterestid_seq,
	interestgroups_interestgroupid_seq,
	outletcoverage_outletcoverageid_seq,
	userdata.collateral_collateral_seq,
	userdata.emailtemplates_emailtemplateid_seq,
	userdata.searchsession_sessionsearchid_seq,
	tg_user_user_id_seq,
	internal.demorequests_demorequestid_seq,
	internal.prmaxroles_prmaxroleid_seq,
	employeeprmaxroles_employeeprmaxroleid_seq
TO prmax;

GRANT UPDATE ON SEQUENCE
internal.customer_customerid_seq,
internal.reporttemplates_reporttemplateid_seq
TO prmax;

GRANT UPDATE ON SEQUENCE
queues.indexerqueue_indexerqueueid_seq,
queues.reports_reportid_seq,
queues.cachequeue_cachequeueid_seq,
queues.emailqueue_emailqueueid_seq
TO prmax;

GRANT UPDATE ON SEQUENCE
userdata.setindex_setindexid_seq,
userdata.list_listid_seq,
userdata.listmembers_listmemberid_seq,
userdata.projects_projectid_seq
TO prmax;


GRANT USAGE ON SCHEMA internal, userdata, queues, cache, seoreleases, accounts,research TO prmax;


GRANT INSERT,UPDATE,DELETE,SELECT ON
customeraccesslog
 TO PRMAX;
