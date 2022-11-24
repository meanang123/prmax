
GRANT USAGE ON SCHEMA queues,internal,seoreleases,userdata,accounts,cache,research TO prmax;
GRANT USAGE ON SCHEMA internal,seoreleases,userdata TO prrelease;

GRANT INSERT,UPDATE,SELECT,DELETE ON TABLE visit,visit_identity,tg_user,tg_group,user_group,outlets,employees,interests,interestwords to prmax;
GRANT INSERT,UPDATE,SELECT,DELETE ON TABLE internal.messagetypes,interestgroups,internal.countries,contacts,addresses,communications to prmax;
GRANT SELECT  ON TABLE internal.geographical,internal.frequencies to prmax;



GRANT SELECT ON ListMember_Ai_View,tg_user TO prapi;
GRANT SELECT ON employeerole_view ,employeeinterest_view,outletinterest_view TO prmax,prmaxquestionnaires,prapi;
GRANT USAGE ON SCHEMA internal,userdata TO prapi;
GRANT INSERT,UPDATE,SELECT,DELETE ON TABLE visit,visit_identity,tg_user,tg_group,user_group,outlets,employees,interests,interestwords to prapi;


GRANT SELECT ON internal.prmax_outlettypes TO prmaxquestionnaires,prmax,prapi;

-- public
GRANT INSERT,UPDATE,SELECT,DELETE ON TABLE addresses, advancefeatures, advancefeaturesinterests,
 communicationext, communications, contacts, employeecustomers, employeeinterests, employeelanguages, employeeprmaxroles, employeeroles,
 employees, employeesubjects, group_permission, interestgroups, interests, interestsubjects, interestwords, logins_tokens, newsfeed, outletcoverage, outletcustomers,
 outletdesk, outletinterests, outletlanguages, outletpostcodes, outletprofile, outlets, outletsearchcirculationtypes, outletsubjects, outlettitles, outlettooutlets,
 permission, tg_group, tg_user, user_default_countries, user_group, visit, visit_identity to prmax;

GRANT INSERT,UPDATE,SELECT,DELETE ON TABLE internal.actiontypes,internal.adjustmenttypes,internal.circulationauditdate, internal.circulationsource,internal.communicationexttypes,internal.contacthistorysources,
 internal.continents, internal.countries, internal.countrytypes, internal.currencies, internal.customerorderstatus, internal.customerpaymenttypes, internal.customerprmaxdatasets, internal.customers, internal.customersources, internal.customerstatus,
 internal.customertypes, internal.deliverypreferences, internal.demorequests, internal.distributionstatus, internal.emailactionstatus, internal.emailsendtypes, internal.financialstatus, internal.frequencies, internal.geographical, internal.geographicallookup,
 internal.geographicallookupcascade, internal.geographicallookuptypes, internal.geographicaltree, internal.geographicalwords, internal.helptree, internal.industries, internal.interestleveltypes, internal.interesttypes, internal.labelrows, internal.labels,
 internal.languages, internal.listtypes, internal.lockedobjects, internal.locktype, internal.messagetypes, internal.mp_county, internal.mp_outlettypes, internal.mp_postcode, internal.mp_region, internal.nbroflogins, internal.newsfeedtypes, internal.objecttypes, internal.outletprices,
 internal.outletsearchtypes, internal.outlettypes, internal.paymentmethods, internal.paymentreturnreason, internal.pressreleasestatus, internal.prmax_outlettypes, internal.prmaxcontrol, internal.prmaxcosts, internal.prmaxcustomerinfo, internal.prmaxdatasetcountries,
 internal.prmaxdatasets, internal.prmaxmodules, internal.prmaxroleinterests, internal.prmaxroles,internal.prmaxrolesynonyms, internal.prmaxrolewords, internal.prmaxsettings, internal.prmaxstatus, internal.productioncompanies, internal.products, internal.producttypes,
 internal.promotions, internal.promotionused, internal.publishers, internal.queryhistory, internal.reasoncategories, internal.reasoncodes, internal.regionalfocus, internal.reportsource, internal.reporttemplates, internal.research_control_record, internal.researchcontact,
 internal.researchexternalcontacts, internal.researchfrequencies, internal.researchprojectstatus, internal.roles, internal.searchtypes, internal.selection, internal.seocategories, internal.seocomplaintstatus, internal.seopaymenttypes, internal.seostatus, internal.sortorder,
 internal.sourcetypes, internal.status, internal.subjects, internal.taskstatus, internal.tasktags, internal.tasktypes, internal.terms, internal.user_session, internal.user_session_images, internal.usertypes, internal.vatcode to prmax;



GRANT INSERT,UPDATE,SELECT,DELETE ON TABLE internal.languages to prmax;


SELECT 'grant UPDATE on SEQUENCE '|| "sequence_name"|| ' to prmax ;' from information_schema.sequences where sequence_catalog='prmax';

select 'grant INSERT,UPDATE,SELECT,DELETE on '||schemaname||'.'||tablename||' to prmax;' from pg_tables where schemaname in ('public','internal') order by schemaname, tablename;

GRANT SELECT,UPDATE,INSERT ON TABLE research.activity,research.activitydetails TO prmaxquestionnaires,prmax;
GRANT UPDATE ON SEQUENCE research.activity_activityid_seq TO prmaxquestionnaires,prmax;
GRANT UPDATE ON SEQUENCE research.activitydetails_activitydetailid_seq TO prmaxquestionnaires,prmax;

GRANT SELECT ON userdata.clientnewsroom TO prrelease;

GRANT INSERT,UPDATE,SELECT,DELETE ON TABLE
seoreleases.seocache,
seoreleases.seocomplaints,
seoreleases.seoimages,
seoreleases.seorelease,
seoreleases.seoreleasecategories,
seoreleases.seoreleaseinterests  to prmax;

