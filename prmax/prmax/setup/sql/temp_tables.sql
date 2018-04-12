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

ALTER TABLE internal.customers ADD COLUMN crm_engagement character varying(45) NOT NULL DEFAULT 'Engagement';
UPDATE internal.customers SET crm_engagement = 'Engagement';

CREATE OR REPLACE FUNCTION SearchEmployeeContactExt(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
    )
  RETURNS bytea
  AS $$

    from ttl.plpython import DBCompress
    from prmax.utilities.search import SearchEmployeeContactExt

    return DBCompress.encode(SearchEmployeeContactExt(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchEmployeeContactExtCount(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
    )
  RETURNS int
  AS $$

    from prmax.utilities.search import SearchEmployeeContactExt

    return len(SearchEmployeeContactExt(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;

ALTER TABLE internal.customers ADD COLUMN crm_engagement_plural character varying(45) NOT NULL DEFAULT 'Engagements';
UPDATE internal.customers SET crm_engagement_plural = 'Engagements';


CREATE TABLE internal.activityobjecttypes
(
  activityobjecttypeid integer NOT NULL,
  activityobjecttypedescription character varying(255) NOT NULL,
  CONSTRAINT pk_activityobjecttype PRIMARY KEY (activityobjecttypeid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.activityobjecttypes OWNER TO postgres;
GRANT ALL ON TABLE internal.activityobjecttypes TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.activityobjecttypes TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.activityobjecttypes TO prmaxcontrol;

CREATE TABLE userdata.activity
(
  activityid serial NOT NULL,
  customerid integer NOT NULL,
  userid integer NOT NULL,
  activitydate timestamp with time zone DEFAULT now(),
  objectid integer NOT NULL,
  objecttypeid integer NOT NULL,
  actiontypeid integer NOT NULL,
  description character varying(255),
  extendeddetails bytea,

  CONSTRAINT pk_activity PRIMARY KEY (activityid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_userid FOREIGN KEY (userid)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_actiontypeid FOREIGN KEY (actiontypeid)
      REFERENCES internal.actiontypes (actiontypeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_objecttypeid FOREIGN KEY (objecttypeid)
      REFERENCES internal.activityobjecttypes (activityobjecttypeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE

)
WITH (
  OIDS=FALSE
);
ALTER TABLE userdata.activity OWNER TO postgres;
GRANT ALL ON TABLE userdata.activity TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.activity TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.activity TO prmaxcontrol;
GRANT ALL ON TABLE userdata.activity_activityid_seq TO postgres;
GRANT UPDATE ON TABLE userdata.activity_activityid_seq TO prmax;
GRANT UPDATE ON TABLE userdata.activity_activityid_seq TO prmaxcontrol;

INSERT INTO internal.activityobjecttypes VALUES (1, 'Engagement');
INSERT INTO internal.activityobjecttypes VALUES (2, 'Clipping');
INSERT INTO internal.activityobjecttypes VALUES (3, 'Issue');
INSERT INTO internal.activityobjecttypes VALUES (4, 'Distribution');

INSERT INTO internal.reportsource VALUES (15, 'Activity Log');

INSERT INTO internal.reporttemplates VALUES
(33, -1, 'Activity Log Report',
'<queries><query type="CUSTOM"></query></queries>',
'', 15, 'ActivityLogReport');

ALTER TABLE internal.customers ADD COLUMN distribution_description character varying(45) NOT NULL DEFAULT 'Distribution';
UPDATE internal.customers SET distribution_description = 'Distribution';

ALTER TABLE internal.customers ADD COLUMN distribution_description_plural character varying(45) NOT NULL DEFAULT 'Distributions';
UPDATE internal.customers SET distribution_description_plural = 'Distributions';

INSERT INTO internal.actiontypes VALUES (7, 'Send');
INSERT INTO internal.actiontypes VALUES (8, 'Resend');


ALTER TABLE userdata.collateral ADD COLUMN automated_source boolean NOT NULL DEFAULT false;
UPDATE userdata.collateral SET automated_source = true WHERE SUBSTRING(collateralname,1,1) IN ('0','1','2','3','4','5','6','7','8','9' ) ;

CREATE TABLE internal.emailservertype
(
   emailservertypeid integer NOT NULL,
   emailservertypename character varying NOT NULL,
    PRIMARY KEY (emailservertypeid)
) WITH (OIDS = FALSE);

ALTER TABLE internal.emailservertype OWNER TO postgres;
GRANT ALL ON TABLE internal.emailservertype TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emailservertype TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emailservertype TO prmaxcontrol;

INSERT INTO internal.emailservertype( emailservertypeid, emailservertypename ) VALUES(1,'localhost'),(2,'Open Relay');

ALTER TABLE userdata.emailserver ADD COLUMN emailservertypeid integer NOT NULL DEFAULT 1;
ALTER TABLE userdata.emailserver ADD FOREIGN KEY (emailservertypeid) REFERENCES internal.emailservertype (emailservertypeid) ON UPDATE NO ACTION ON DELETE RESTRICT;

-- INSERT INTO userdata.emailserver( email_host, emailservertypeid) VALUES ('shielporter.com.outbound1-uk.mailanyone.net',2);

ALTER TABLE tg_user ADD COLUMN passwordrecovery boolean NOT NULL DEFAULT false;
UPDATE tg_user SET passwordrecovery = false;

DROP VIEW user_external_view;
CREATE OR REPLACE VIEW user_external_view AS
SELECT u.user_id,
 u.user_name,
 u.email_address,
 u.display_name,
 u.projectname,
 u.interface_font_size,
 u.interface_font_family,
 u.show_dialog_on_load,
 u.showmenubartext,
 u.autoselectfirstrecord,
 u.isuseradmin,
 u.usepartialmatch,
 u.searchappend,
 u.emailreplyaddress,
 u.test_extensions,
 u.stdview_sortorder,
 u.canviewfinancial,
 u.client_name,
 u.issue_description,
 u.external_key,
 u.passwordrecovery,
 u.force_passwordrecovery
   FROM tg_user u;

ALTER TABLE user_external_view OWNER TO postgres;
GRANT ALL ON TABLE user_external_view TO postgres;
GRANT SELECT ON TABLE user_external_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE user_external_view TO prmaxcontrol;

CREATE TABLE public.passwordrecoverydetails
(
  userid integer NOT NULL,
  recovery_email character varying,
  recovery_phone character varying,
  recovery_word character varying,
  created timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT pk_passwordrecovery PRIMARY KEY (userid),
  CONSTRAINT fk_userid FOREIGN KEY (userid)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.passwordrecoverydetails OWNER TO postgres;
GRANT ALL ON TABLE public.passwordrecoverydetails TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE public.passwordrecoverydetails TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE public.passwordrecoverydetails TO prmaxcontrol;

CREATE TABLE public.tg_password_request
(
  password_guid character varying NOT NULL,
  userid integer NOT NULL,
  created timestamp without time zone NOT NULL DEFAULT now(),
  expirydate timestamp without time zone,
  details_confirmed boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 0,
  CONSTRAINT pk_password_guid PRIMARY KEY (password_guid),
  CONSTRAINT fk_userid FOREIGN KEY (userid)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.tg_password_request OWNER TO postgres;
GRANT ALL ON TABLE public.tg_password_request TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE public.tg_password_request TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE public.tg_password_request TO prmaxcontrol;

ALTER TABLE tg_user ADD COLUMN invalid_reset_tries integer NOT NULL DEFAULT 0;
UPDATE tg_user SET invalid_reset_tries = 0;

ALTER TABLE tg_user ADD COLUMN force_passwordrecovery boolean NOT NULL DEFAULT false;
UPDATE tg_user SET force_passwordrecovery = false;

ALTER TABLE internal.customers ADD COLUMN thirdparty boolean NOT NULL DEFAULT false;
UPDATE internal.customers SET thirdparty = false;

INSERT INTO internal.circulationauditdate (circulationauditdatedescription) VALUES ('jul - sept 17');
INSERT INTO internal.circulationauditdate (circulationauditdatedescription) VALUES ('oct - dec 17');
INSERT INTO internal.languages(languagename) VALUES ('Chechen');

ALTER TABLE internal.customers ADD COLUMN briefing_notes_description character varying(45) NOT NULL DEFAULT 'Briefing Notes';
UPDATE internal.customers SET briefing_notes_description = 'Briefing Notes';

ALTER TABLE internal.customers ADD COLUMN response_description character varying(45) NOT NULL DEFAULT 'Response';
UPDATE internal.customers SET response_description = 'Response';

ALTER TABLE internal.customers ADD COLUMN has_global_newsroom BOOLEAN NOT NULL DEFAULT false;
UPDATE internal.customers SET has_global_newsroom = false;

DELETE FROM  userdata.clientnewsroom
WHERE clientid IN ( SELECT cnr.clientid FROM userdata.clientnewsroom as cnr
left outer join userdata.client as c on c.clientid = cnr.clientid
WHERE c.clientid is null ) ;

ALTER TABLE userdata.clientnewsroom DROP CONSTRAINT pk_clientnewsroom;
ALTER TABLE userdata.clientnewsroom ADD COLUMN newsroomid serial NOT NULL;
ALTER TABLE userdata.clientnewsroom ADD PRIMARY KEY (newsroomid);
ALTER TABLE userdata.clientnewsroom ADD FOREIGN KEY (clientid) REFERENCES userdata.client (clientid) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE userdata.clientnewsroom ALTER COLUMN clientid DROP NOT NULL;
ALTER TABLE userdata.clientnewsroom ADD COLUMN description character varying(80);

ALTER TABLE userdata.clientnewsroomcustumlinks ALTER COLUMN clientid DROP NOT NULL;
ALTER TABLE userdata.clientnewsroomcustumlinks ADD COLUMN newsroomid integer;
ALTER TABLE userdata.clientnewsroomcustumlinks ADD FOREIGN KEY (newsroomid) REFERENCES userdata.clientnewsroom (newsroomid) ON UPDATE NO ACTION ON DELETE RESTRICT;
ALTER TABLE userdata.clientnewsroomcustumlinks DROP CONSTRAINT un_linkname;
ALTER TABLE userdata.clientnewsroomcustumlinks ADD UNIQUE (newsroomid, "name");

ALTER TABLE userdata.clientnewsroomimage ALTER COLUMN clientid DROP NOT NULL;
ALTER TABLE userdata.clientnewsroomimage ADD COLUMN newsroomid integer;
ALTER TABLE userdata.clientnewsroomimage ADD FOREIGN KEY (newsroomid) REFERENCES userdata.clientnewsroom (newsroomid) ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE userdata.clientnewsroomimage DROP CONSTRAINT un_control;
ALTER TABLE userdata.clientnewsroomimage ADD CONSTRAINT un_control UNIQUE (newsroomid, imagetypeid);

GRANT ALL ON TABLE userdata.clientnewsroom_newsroomid_seq TO postgres;
GRANT UPDATE ON TABLE userdata.clientnewsroom_newsroomid_seq TO prmax;
GRANT UPDATE ON TABLE userdata.clientnewsroom_newsroomid_seq TO prmaxcontrol;

UPDATE userdata.clientnewsroomcustumlinks AS cncl
SET newsroomid = cnr.newsroomid
FROM 
userdata.clientnewsroom AS cnr
WHERE cnr.clientid = cncl.clientid AND 
cncl.newsroomid is null;

UPDATE userdata.clientnewsroomimage AS cncl
SET newsroomid = cnr.newsroomid
FROM 
userdata.clientnewsroom AS cnr
WHERE cnr.clientid = cncl.clientid AND 
cncl.newsroomid is null;

CREATE TABLE seoreleases.seonewsrooms
(
   seoreleaseid integer NOT NULL,
   newsroomid integer NOT NULL,
    PRIMARY KEY (seoreleaseid, newsroomid),
    FOREIGN KEY (seoreleaseid) REFERENCES seoreleases.seorelease (seoreleaseid) ON UPDATE NO ACTION ON DELETE CASCADE,
    FOREIGN KEY (newsroomid) REFERENCES userdata.clientnewsroom (newsroomid) ON UPDATE NO ACTION ON DELETE CASCADE
) WITH ( OIDS = FALSE);

GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE  seoreleases.seonewsrooms TO prmax;
GRANT SELECT ON TABLE  seoreleases.seonewsrooms TO prrelease;

CREATE TABLE userdata.clientnewroomcontactdetails
(
   newsroomid integer NOT NULL,
   www character varying,
   tel character varying,
   email character varying,
   linkedin character varying,
   facebook character varying,
   twitter character varying,
    PRIMARY KEY (newsroomid),
    FOREIGN KEY (newsroomid) REFERENCES userdata.clientnewsroom (newsroomid) ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (OIDS = FALSE);

GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE  userdata.clientnewroomcontactdetails TO prmax;
GRANT SELECT ON TABLE  userdata.clientnewroomcontactdetails TO prrelease;
