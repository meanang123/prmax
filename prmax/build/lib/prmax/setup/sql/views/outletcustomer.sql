DROP VIEW outletcustomer_view;
CREATE OR REPLACE VIEW outletcustomer_view AS SELECT
c.outletid,c.customerid,c.profile,c.donotuse,
cc.email, cc.tel, cc.fax, cc.mobile, cc.webphone,
a.address1, a.address2, a.townname, a.county, a.postcode,
c.primaryemployeeid
FROM outletcustomers as c
LEFT OUTER JOIN communications as cc ON cc.communicationid = c.communicationid
LEFT OUTER JOIN addresses as a ON cc.addressid = a.addressid;


GRANT SELECT ON outletcustomer_view TO prmax;