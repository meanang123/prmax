
--DROP VIEW outletinterest_view;
CREATE OR REPLACE VIEW outletinterest_view AS
 SELECT oi.outletinterestid, oi.customerid, oi.outletid, oi.interestid, i.interestname,i.interesttypeid
   FROM outletinterests oi
   JOIN interests i ON i.interestid = oi.interestid
  ORDER BY i.interestname;

GRANT SELECT ON outletinterest_view TO prmax,prapi;


--DROP VIEW employeeinterest_view;
CREATE OR REPLACE VIEW employeeinterest_view AS
 SELECT oi.employeeinterestid, oi.customerid, oi.employeeid, oi.interestid, i.interestname,i.interesttypeid
   FROM employeeinterests oi
   JOIN interests i ON i.interestid = oi.interestid
  ORDER BY i.interestname;

GRANT SELECT ON employeeinterest_view TO prmax,prapi;


