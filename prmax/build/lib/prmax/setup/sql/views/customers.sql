DROP VIEW customer_external_view;
CREATE OR REPLACE VIEW customer_external_view AS SELECT
c.customerid,
c.customername, c.contact_title, c.contact_firstname, c.contact_surname, c.email, c.tel,
to_char(c.licence_expire, 'dd/mm/yy') as licence_expire,
c.logins, a.address1, a.address2, a.townname, a.county, a.postcode,
c.isdemo,c.productid,customertypeid,
c.advancefeatures,
c.crm,
c.search_show_job_roles,
c.search_show_coverage,
c.search_show_profile,
c.search_show_smart
FROM internal.customers as c
LEFT OUTER JOIN addresses as a ON c.addressid = a.addressid;

GRANT SELECT ON customer_external_view TO prmax;
