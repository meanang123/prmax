-- DROP VIEW employeerole_view;
CREATE OR REPLACE VIEW employeerole_view AS SELECT
er.employeeid,e.customerid,r.prmaxrole as rolename
FROM employeeprmaxroles as er
LEFT OUTER JOIN employees as e ON e.employeeid = er.employeeid
LEFT OUTER JOIN internal.prmaxroles as r ON er.prmaxroleid = r.prmaxroleid;

GRANT SELECT ON employeerole_view TO prmax,prmaxquestionnaires,prapi;
