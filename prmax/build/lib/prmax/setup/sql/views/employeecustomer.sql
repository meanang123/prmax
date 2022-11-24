-- DROP VIEW employeecustomer_view;
CREATE OR REPLACE VIEW employeecustomer_view AS SELECT
c.employeeid,c.customerid,c.profile,c.donotuse,
cc.email, cc.tel, cc.fax, cc.mobile, cc.webphone,
a.address1, a.address2, a.townname, a.county, a.postcode
FROM employeecustomers as c
LEFT OUTER JOIN communications as cc ON cc.communicationid = c.communicationid
LEFT OUTER JOIN addresses as a ON cc.addressid = a.addressid;

GRANT SELECT ON employeecustomer_view TO prmax;
