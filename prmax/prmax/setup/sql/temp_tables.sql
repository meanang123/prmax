﻿

-- reset index's for clipping speed up delete ?
ALTER TABLE userdata.clippings DROP CONSTRAINT clippings_listmemberid_fkey;
ALTER TABLE userdata.clippings DROP CONSTRAINT clippings_outletid_fkey1;
ALTER TABLE clippingstore DROP CONSTRAINT clippingstore_outletid_fkey;



ALTER TABLE userdata.clippings ADD CONSTRAINT fk_listmembers FOREIGN KEY (listmemberid) REFERENCES userdata.listmembers (listmemberid)
   ON UPDATE NO ACTION ON DELETE SET NULL;
CREATE INDEX fki_listmembers ON userdata.clippings(listmemberid);

ALTER TABLE userdata.clippings ADD CONSTRAINT fk_cl_outletid FOREIGN KEY (outletid) REFERENCES outlets (outletid)
   ON UPDATE NO ACTION ON DELETE SET NULL;
CREATE INDEX fki_cl_outletid ON userdata.clippings(outletid);

ALTER TABLE clippingstore ADD CONSTRAINT fk_cs_outletid FOREIGN KEY (outletid) REFERENCES outlets (outletid)
   ON UPDATE NO ACTION ON DELETE SET NULL;
CREATE INDEX fki_cs_outletid ON clippingstore(outletid);


INSERT INTO internal.reporttemplates VALUES (32, -1, 'Statistics Report', '<queries><query type="CUSTOM"></query></queries>', '', 9, 'StatisticsReport');

UPDATE communications SET instagram = '' WHERE instagram is null;
UPDATE userdata.client SET instagram = '' WHERE instagram is null;
UPDATE seoreleases.seorelease SET instagram = '' WHERE instagram is null;


ALTER TABLE internal.sortorder ALTER sortorderfieldname TYPE character varying (55);
UPDATE internal.sortorder 
   SET sortorderfieldname = 'UPPER(familyname) %order%, UPPER(firstname) %order%'
 WHERE sortorderid = 2;

DROP VIEW search_results_view_standard;
CREATE OR REPLACE VIEW search_results_view_standard AS 
 SELECT s.sessionsearchid, s.selected, json_encode(
        CASE
            WHEN o.outlettypeid = 19 THEN ''::character varying
            WHEN o.prmax_outlettypeid = ANY (ARRAY[50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]) THEN ''::character varying
            ELSE o.outletname
        END::text) AS outletname, 
        CASE
            WHEN s.outletdeskid IS NULL AND e.contactid IS NOT NULL THEN json_encode(contactname(c.prefix::text, c.firstname::text, c.middlename::text, c.familyname::text, c.suffix::text))
            ELSE ''::text
        END AS contactname, s.outletid, 
        CASE
            WHEN s.employeeid IS NULL THEN o.primaryemployeeid
            ELSE s.employeeid
        END AS employeeid, o.customerid, o.outlettypeid, 
        CASE
            WHEN e.customerid = (-1) THEN 0
            ELSE 1
        END AS employee_private, s.appended, e.customerid AS ecustomerid, 
        CASE
            WHEN oc.primaryemployeeid IS NOT NULL AND (s.employeeid = oc.primaryemployeeid OR s.employeeid IS NULL) THEN true
            ELSE false
        END AS override_primary, s.userid, s.searchtypeid, c.familyname, c.firstname, o.circulation, e.job_title, pr.prmax_outletgroupid, pr.sortorder, COALESCE(e.prmaxstatusid, 1) AS prmaxstatusid, upper(o.outletname::text) AS sortname, get_override(ec_c.email::text, e_c.email::text, oc_oc.email::text, o_c.email::text) AS email, country.countryname, s.outletdeskid, od.deskname
   FROM userdata.searchsession s
   JOIN outlets o ON o.outletid = s.outletid
   LEFT JOIN outletcustomers oc ON s.outletid = oc.outletid AND s.customerid = oc.customerid
   LEFT JOIN employees e ON COALESCE(s.employeeid, oc.primaryemployeeid, o.primaryemployeeid) = e.employeeid
   JOIN tg_user u ON s.userid = u.user_id
   LEFT JOIN contacts c ON e.contactid = c.contactid
   LEFT JOIN internal.prmax_outlettypes pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
   LEFT JOIN employeecustomers ec ON ec.employeeid = COALESCE(s.employeeid, oc.primaryemployeeid, o.primaryemployeeid) AND ec.customerid = s.customerid
   LEFT JOIN communications o_c ON o_c.communicationid = o.communicationid
   LEFT JOIN communications oc_oc ON oc_oc.communicationid = oc.communicationid
   LEFT JOIN communications e_c ON e_c.communicationid = e.communicationid
   LEFT JOIN communications ec_c ON ec_c.communicationid = ec.communicationid
   LEFT JOIN outletdesk od ON od.outletdeskid = s.outletdeskid
   LEFT JOIN internal.countries country ON country.countryid = COALESCE(o.nationid, o.countryid)
  ORDER BY o.outletname;
ALTER TABLE search_results_view_standard OWNER TO postgres;
GRANT ALL ON TABLE search_results_view_standard TO postgres;
GRANT SELECT ON TABLE search_results_view_standard TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE search_results_view_standard TO prmaxcontrol;

DROP VIEW listmember_view;
CREATE OR REPLACE VIEW listmember_view AS 
 SELECT lm.listmemberid, lm.listid, json_encode(
        CASE
            WHEN o.outlettypeid = 19 THEN ''::character varying
            WHEN o.prmax_outlettypeid = ANY (ARRAY[50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]) THEN ''::character varying
            ELSE o.outletname
        END::text) AS outletname, json_encode(contactname(c.prefix::text, c.firstname::text, c.middlename::text, c.familyname::text, c.suffix::text)) AS contactname, lm.outletid, 
        CASE
            WHEN lm.employeeid IS NULL THEN o.primaryemployeeid
            ELSE lm.employeeid
        END AS employeeid, o.customerid, o.outlettypeid, 
        CASE
            WHEN e.customerid = (-1) THEN 0
            ELSE 1
        END AS employee_private, e.customerid AS ecustomerid, 
        CASE
            WHEN oc.primaryemployeeid IS NOT NULL AND (lm.employeeid = oc.primaryemployeeid OR lm.employeeid IS NULL) THEN true
            ELSE false
        END AS override_primary, c.familyname, c.firstname, o.circulation, e.job_title, pr.prmax_outletgroupid, pr.sortorder, lm.selected, upper(o.outletname::text) AS sortname
   FROM userdata.listmembers lm
   JOIN userdata.list l ON lm.listid = l.listid
   JOIN outlets o ON o.outletid = lm.outletid
   LEFT JOIN outletcustomers oc ON lm.outletid = oc.outletid AND l.customerid = oc.customerid
   JOIN employees e ON COALESCE(lm.employeeid, oc.primaryemployeeid, o.primaryemployeeid) = e.employeeid
   LEFT JOIN contacts c ON e.contactid = c.contactid
   LEFT JOIN internal.prmax_outlettypes pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
  ORDER BY o.outletname;
ALTER TABLE listmember_view OWNER TO postgres;
GRANT ALL ON TABLE listmember_view TO postgres;
GRANT SELECT ON TABLE listmember_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE listmember_view TO prmaxcontrol;

delete from cache.cachestore;

ALTER TABLE tg_user DROP CONSTRAINT tg_user_email_address_key;