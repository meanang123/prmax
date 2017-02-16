DROP VIEW research_external_data;

CREATE VIEW research_external_data AS
SELECT
u.user_id,
rxt.researchexternalcontactid,
rxt.outletid,
con.familyname, con.firstname, con.prefix,
a.address1,
a.address2,
a.townname,
a.county,
a.postcode,
o.www,
com.tel,
com.email,
com.fax,
com.twitter,
com.facebook

FROM tg_user AS u
JOIN internal.researchexternalcontacts AS rxt ON rxt.researchexternalcontactid = u.researchexternalcontactid
JOIN outlets AS o ON o.outletid = rxt.outletid
JOIN communications AS com ON com.communicationid = o.communicationid
JOIN addresses AS a ON a.addressid = com.addressid
JOIN employees AS e on o.primaryemployeeid = e.employeeid
JOIN contacts AS con ON con.contactid = e.contactid;

GRANT SELECT ON research_external_data TO prcontact;