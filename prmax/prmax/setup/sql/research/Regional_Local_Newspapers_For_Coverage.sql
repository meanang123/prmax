\a 
\t 
\o /tmp/coverage.txt
select o.outletid,o.outletname,ot.prmax_outlettypename,o.www,a.address1,a.address2,a.townname,a.county,a.postcode,c.tel
FROM outlets as o
JOIN internal.prmax_outlettypes as ot ON o.prmax_outlettypeid = ot.prmax_outlettypeid
JOIN communications AS c on c.communicationid = o.communicationid 
JOIN addresses AS a ON a.addressid = c.addressid
WHERE 
ot.prmax_outlettypename ilike '%regional%' or ot.prmax_outlettypename ilike '%local%'
AND o.prn_key>0
ORDER BY o.outletname;
\o 