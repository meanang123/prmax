DROP VIEW outletcoverage_view;
CREATE OR REPLACE VIEW outletcoverage_view AS SELECT
oc.outletid,oc.customerid,g.geographicalid,g.geographicalname
FROM outletcoverage as oc
LEFT JOIN internal.geographical as g ON g.geographicalid = oc.geographicalid
ORDER BY g.geographicalname;

GRANT SELECT ON outletcoverage_view TO prmax;