GRANT ALL ON TABLE accounts_active_customer_report TO postgres;
GRANT SELECT ON TABLE accounts_active_customer_report TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE accounts_active_customer_report TO prmaxcontrol;
ALTER TABLE advancefeaturesinterest_view OWNER TO postgres;
GRANT ALL ON TABLE advancefeaturesinterest_view TO postgres;
GRANT SELECT ON TABLE advancefeaturesinterest_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE advancefeaturesinterest_view TO prmaxcontrol;
ALTER TABLE advancefeatureslistresultview OWNER TO postgres;
GRANT ALL ON TABLE advancefeatureslistresultview TO postgres;
GRANT SELECT ON TABLE advancefeatureslistresultview TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE advancefeatureslistresultview TO prmaxcontrol;
ALTER TABLE advancelist_view_extended OWNER TO postgres;
GRANT ALL ON TABLE advancelist_view_extended TO postgres;
GRANT SELECT ON TABLE advancelist_view_extended TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE advancelist_view_extended TO prmaxcontrol;
ALTER TABLE customer_external_view OWNER TO postgres;
GRANT ALL ON TABLE customer_external_view TO postgres;
GRANT SELECT ON TABLE customer_external_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE customer_external_view TO prmaxcontrol;
ALTER TABLE distributed_view OWNER TO postgres;
GRANT ALL ON TABLE distributed_view TO postgres;
GRANT SELECT ON TABLE distributed_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE distributed_view TO prmaxcontrol;
ALTER TABLE employeecustomer_view OWNER TO postgres;
GRANT ALL ON TABLE employeecustomer_view TO postgres;
GRANT SELECT ON TABLE employeecustomer_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE employeecustomer_view TO prmaxcontrol;
ALTER TABLE employeeinterest_view OWNER TO postgres;
GRANT ALL ON TABLE employeeinterest_view TO postgres;
GRANT SELECT ON TABLE employeeinterest_view TO prmax;
GRANT SELECT ON TABLE employeeinterest_view TO prapi;
GRANT SELECT ON TABLE employeeinterest_view TO prmaxquestionnaires;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE employeeinterest_view TO prmaxcontrol;
ALTER TABLE employeerole_view OWNER TO postgres;
GRANT ALL ON TABLE employeerole_view TO postgres;
GRANT SELECT ON TABLE employeerole_view TO prmax;
GRANT SELECT ON TABLE employeerole_view TO prmaxquestionnaires;
GRANT SELECT ON TABLE employeerole_view TO prapi;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE employeerole_view TO prmaxcontrol;
ALTER TABLE geographical_lookup_view OWNER TO postgres;
GRANT ALL ON TABLE geographical_lookup_view TO postgres;
GRANT SELECT ON TABLE geographical_lookup_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE geographical_lookup_view TO prmaxcontrol;
ALTER TABLE geographical_lookup_word_view OWNER TO postgres;
GRANT ALL ON TABLE geographical_lookup_word_view TO postgres;
GRANT SELECT ON TABLE geographical_lookup_word_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE geographical_lookup_word_view TO prmaxcontrol;
ALTER TABLE listmember_ai_view OWNER TO postgres;
GRANT ALL ON TABLE listmember_ai_view TO postgres;
GRANT SELECT ON TABLE listmember_ai_view TO prapi;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE listmember_ai_view TO prmaxcontrol;
ALTER TABLE listmember_view OWNER TO postgres;
GRANT ALL ON TABLE listmember_view TO postgres;
GRANT SELECT ON TABLE listmember_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE listmember_view TO prmaxcontrol;
ALTER TABLE outletcoverage_view OWNER TO postgres;
GRANT ALL ON TABLE outletcoverage_view TO postgres;
GRANT SELECT ON TABLE outletcoverage_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE outletcoverage_view TO prmaxcontrol;
ALTER TABLE outletcustomer_view OWNER TO postgres;
GRANT ALL ON TABLE outletcustomer_view TO postgres;
GRANT SELECT ON TABLE outletcustomer_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE outletcustomer_view TO prmaxcontrol;
ALTER TABLE outletinterest_view OWNER TO prmax;
GRANT ALL ON TABLE outletinterest_view TO prmax;
GRANT SELECT ON TABLE outletinterest_view TO prmaxquestionnaires;
GRANT SELECT ON TABLE outletinterest_view TO prapi;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE outletinterest_view TO prmaxcontrol;
ALTER TABLE prmaxroleinterest_view OWNER TO postgres;
GRANT ALL ON TABLE prmaxroleinterest_view TO postgres;
GRANT SELECT ON TABLE prmaxroleinterest_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE prmaxroleinterest_view TO prmaxcontrol;
ALTER TABLE prmaxrolesinterest_view OWNER TO postgres;
GRANT ALL ON TABLE prmaxrolesinterest_view TO postgres;
GRANT SELECT ON TABLE prmaxrolesinterest_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE prmaxrolesinterest_view TO prmaxcontrol;
ALTER TABLE prmaxrolesynonyms_view OWNER TO postgres;
GRANT ALL ON TABLE prmaxrolesynonyms_view TO postgres;
GRANT SELECT ON TABLE prmaxrolesynonyms_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE prmaxrolesynonyms_view TO prmaxcontrol;
ALTER TABLE research_external_data OWNER TO postgres;
GRANT ALL ON TABLE research_external_data TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE research_external_data TO prmaxcontrol;
ALTER TABLE search_results_view_report OWNER TO postgres;
GRANT ALL ON TABLE search_results_view_report TO postgres;
GRANT SELECT ON TABLE search_results_view_report TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE search_results_view_report TO prmaxcontrol;

ALTER TABLE search_results_view_report_outlet OWNER TO postgres;
GRANT ALL ON TABLE search_results_view_report_outlet TO postgres;
GRANT SELECT ON TABLE search_results_view_report_outlet TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE search_results_view_report_outlet TO prmaxcontrol;
ALTER TABLE search_results_view_standard OWNER TO postgres;
GRANT ALL ON TABLE search_results_view_standard TO postgres;
GRANT SELECT ON TABLE search_results_view_standard TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE search_results_view_standard TO prmaxcontrol;
ALTER TABLE user_external_view OWNER TO postgres;
GRANT ALL ON TABLE user_external_view TO postgres;
GRANT SELECT ON TABLE user_external_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE user_external_view TO prmaxcontrol;