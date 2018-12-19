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

GRANT ALL ON TABLE userdata.clientnewsroom_newsroomid_seq TO postgres;
GRANT UPDATE ON TABLE userdata.clientnewsroom_newsroomid_seq TO prmax;
GRANT UPDATE ON TABLE userdata.clientnewsroom_newsroomid_seq TO prmaxcontrol;

ALTER TABLE userdata.clientnewsroomcustumlinks ALTER COLUMN clientid DROP NOT NULL;
ALTER TABLE userdata.clientnewsroomcustumlinks ADD COLUMN newsroomid integer;
ALTER TABLE userdata.clientnewsroomcustumlinks ADD FOREIGN KEY (newsroomid) REFERENCES userdata.clientnewsroom (newsroomid) ON UPDATE NO ACTION ON DELETE RESTRICT;
ALTER TABLE userdata.clientnewsroomcustumlinks ADD UNIQUE (newsroomid, "name");

ALTER TABLE userdata.clientnewsroomimage ALTER COLUMN clientid DROP NOT NULL;
ALTER TABLE userdata.clientnewsroomimage ADD COLUMN newsroomid integer;
ALTER TABLE userdata.clientnewsroomimage ADD FOREIGN KEY (newsroomid) REFERENCES userdata.clientnewsroom (newsroomid) ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE userdata.clientnewsroomimage ADD UNIQUE (newsroomid, imagetypeid);

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

INSERT INTO  seoreleases.seonewsrooms (SELECT seoreleaseid, newsroomid
					FROM seoreleases.seorelease as s
					JOIN userdata.clientnewsroom as cnr on s.clientid = cnr.clientid);

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

ALTER TABLE userdata.clientnewsroomcustumlinks DROP CONSTRAINT un_linkname;
ALTER TABLE userdata.clientnewsroomimage DROP CONSTRAINT un_control;

ALTER TABLE userdata.clientnewroomcontactdetails ADD COLUMN instagram character varying;

DROP INDEX userdata.index_clientnewsroom_root;

ALTER TABLE internal.customers ADD COLUMN crm_outcome_page_1 boolean;
ALTER TABLE internal.customers ALTER COLUMN crm_outcome_page_1 SET DEFAULT false;
ALTER TABLE internal.customers ALTER COLUMN crm_outcome_page_1 SET NOT NULL;
ALTER TABLE internal.customers ADD COLUMN crm_response_page_1 boolean;
ALTER TABLE internal.customers ALTER COLUMN crm_response_page_1 SET DEFAULT true;
ALTER TABLE internal.customers ALTER COLUMN crm_response_page_1 SET NOT NULL;
ALTER TABLE internal.customers ADD COLUMN crm_analysis_page_1 boolean;
ALTER TABLE internal.customers ALTER COLUMN crm_analysis_page_1 SET DEFAULT true;
ALTER TABLE internal.customers ALTER COLUMN crm_analysis_page_1 SET NOT NULL;
ALTER TABLE internal.customers ADD COLUMN crm_briefingnotes_page_1 boolean;
ALTER TABLE internal.customers ALTER COLUMN crm_briefingnotes_page_1 SET DEFAULT true;
ALTER TABLE internal.customers ALTER COLUMN crm_briefingnotes_page_1 SET NOT NULL;

ALTER TABLE internal.customers ADD COLUMN has_global_newsroom boolean;
ALTER TABLE internal.customers ALTER COLUMN has_global_newsroom SET DEFAULT false;
ALTER TABLE internal.customers ALTER COLUMN has_global_newsroom SET NOT NULL;

DELETE FROM seoreleases.seocache;
ALTER TABLE seoreleases.seocache ADD COLUMN newsroomid integer NOT NULL;
ALTER TABLE seoreleases.seocache DROP CONSTRAINT pk_cache;
ALTER TABLE seoreleases.seocache ADD CONSTRAINT pk_cache PRIMARY KEY (seoreleaseid, newsroomid, layout);

ALTER TABLE seoreleases.seorelease ADD COLUMN is_client_newsroom boolean;
ALTER TABLE seoreleases.seorelease ALTER COLUMN is_client_newsroom SET DEFAULT true;
UPDATE seoreleases.seorelease SET is_client_newsroom = true;
ALTER TABLE seoreleases.seorelease ALTER COLUMN is_client_newsroom SET NOT NULL;

ALTER TABLE userdata.collateral ADD COLUMN newsroomid integer;


DROP FUNCTION employee_empty(integer);
CREATE OR REPLACE FUNCTION employee_empty(p_employeeid integer)
  RETURNS void AS
$BODY$
DECLARE
BEGIN
	-- make sure all sub-info has been deleted
	DELETE FROM employeeinterests where employeeid = p_employeeid;
	DELETE FROM employeeprmaxroles where employeeid = p_employeeid;
	-- didn't get name
	--
	UPDATE employees SET prmaxstatusid = 2, contactid = NULL WHERE employeeid = p_employeeid;
	UPDATE communications SET email = '', tel = '', fax = '',  mobile = '', webphone = '', twitter = '', facebook = '', linkedin = '', blog = '', instagram = ''
	WHERE communicationid = (SELECT communicationid FROM employees WHERE employeeid = p_employeeid);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE SECURITY DEFINER
  COST 100;
ALTER FUNCTION employee_empty(integer) OWNER TO postgres;

UPDATE userdata.clippings SET clippingstoneid = 3 WHERE clippingstoneid = 6;
DELETE FROM internal.clippingstone WHERE clippingstoneid = 6;
UPDATE research.datasourcetranslations SET translation = 3 where datasourcetranslationid = 858;

INSERT INTO internal.actiontypes VALUES (9, 'Send - domain check failed');

CREATE TABLE seoreleases.seotranslations
(
  seoreleaseid integer NOT NULL,
  languageid integer NOT NULL,
  translatedseoreleaseid integer NOT NULL,
  translatedlanguageid integer NOT NULL,
  PRIMARY KEY (seoreleaseid, languageid),
  CONSTRAINT fk_seoreleaseid FOREIGN KEY (seoreleaseid)
      REFERENCES seoreleases.seorelease (seoreleaseid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_translateseoreleaseid FOREIGN KEY (seoreleaseid)
      REFERENCES seoreleases.seorelease (seoreleaseid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_languageid FOREIGN KEY (languageid)
      REFERENCES internal.languages (languageid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_translatedlanguageid FOREIGN KEY (languageid)
      REFERENCES internal.languages (languageid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE seoreleases.seotranslations OWNER TO postgres;
GRANT ALL ON TABLE seoreleases.seotranslations TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE seoreleases.seotranslations TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE seoreleases.seotranslations TO prmaxcontrol;
GRANT SELECT, UPDATE, INSERT ON TABLE seoreleases.seotranslations TO prrelease;

ALTER TABLE seoreleases.seotranslations ADD UNIQUE (seoreleaseid, languageid, translatedseoreleaseid, translatedlanguageid);

ALTER TABLE internal.customers ADD COLUMN seotranslation boolean;
ALTER TABLE internal.customers ALTER COLUMN seotranslation SET DEFAULT false;
UPDATE internal.customers SET seotranslation = false;

ALTER TABLE seoreleases.seorelease ADD COLUMN languageid integer;
ALTER TABLE seoreleases.seorelease ALTER COLUMN languageid SET DEFAULT 1945;
ALTER TABLE seoreleases.seorelease ADD CONSTRAINT fk_languageid FOREIGN KEY (languageid) REFERENCES internal.languages (languageid) MATCH SIMPLE;

UPDATE seoreleases.seorelease SET languageid = 1945 WHERE clientid != 1966;
UPDATE seoreleases.seorelease SET languageid = 1936 WHERE clientid = 1966;

DELETE FROM seoreleases.seocache;

CREATE TABLE userdata.searchcrm
(
  searchcrmid serial NOT NULL,
  userid integer NOT NULL,
  customerid integer NOT NULL,
  contacthistoryid integer,
  PRIMARY KEY (searchcrmid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_userid FOREIGN KEY (userid)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_contacthistoryid FOREIGN KEY (contacthistoryid)
      REFERENCES userdata.contacthistory (contacthistoryid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE userdata.searchcrm OWNER TO postgres;
GRANT ALL ON TABLE userdata.searchcrm TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.searchcrm TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.searchcrm TO prmaxcontrol;
GRANT SELECT, UPDATE, INSERT ON TABLE userdata.searchcrm TO prrelease;


-- Function: loadcrm(bytea, integer, integer, integer, text)

-- DROP FUNCTION loadcrm(bytea, integer, integer, integer, text);

CREATE OR REPLACE FUNCTION loadcrm(commandtext bytea, p_userid integer, p_searchtypeid integer, p_newsession_in integer, p_searchtype text)
  RETURNS SETOF searchsessionstatisticsext AS
$BODY$
  DECLARE
  p_customerid integer;
  p_count integer;
  p_newsession integer;
  BEGIN
  p_newsession = p_newsession_in;
  -- if this is an append and entries are 0 then chabge mode
  if p_newsession=0 THEN
	SELECT COUNT(*) INTO p_count FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
	if p_count=0 OR p_count IS NULL THEN
	p_newsession=1;
	END IF;

  END IF;
  -- Check for new session
  if p_newsession=1 THEN
    DELETE FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
  ELSE
    UPDATE userdata.searchsession SET appended=false WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
  END IF;

  SELECT INTO p_customerid customerid  from tg_user where user_id =  p_userid;

  -- put into temp table
  DROP TABLE IF EXISTS searchcrm_temp;

  CREATE temporary TABLE searchcrm_temp AS SELECT p_userid as userid ,p_searchtypeid as searchtypeid, contacthistoryid FROM doCrmSearch(commandtext) ;

  INSERT INTO userdata.searchsession(userid,searchtypeid,contacthistoryid,customerid) SELECT p_userid,p_searchtypeid,contacthistoryid,p_customerid
        FROM searchcrm_temp
		WHERE contacthistoryid NOT IN (SELECT contacthistoryid FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid=p_searchtypeid);

  DROP TABLE IF EXISTS searchcrm_temp;

  -- return statistics
  RETURN QUERY SELECT * from crmcount(p_searchtypeid,p_userid);

  END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION loadcrm(bytea, integer, integer, integer, text) OWNER TO postgres;


-- Function: docrmsearch(bytea)

-- DROP FUNCTION docrmsearch(bytea);

CREATE OR REPLACE FUNCTION docrmsearch(commandtext bytea)
  RETURNS SETOF searchresult AS
$BODY$

  import  prmax.Constants as Constants
  from ttl.plpython import DBCompress
  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.search import doCrmSearch

  commands = DBCompress.decode(commandtext)
  logic=Constants.Search_And

  controlSettings = PostGresControl(plpy)

  overallResult = None
  levellists = doCrmSearch(commands, plpy)

  if len(levellists[Constants.Search_Data_Crm])==1:
	overallResult = levellists[Constants.Search_Data_Crm][0]
  else:
	for rowData in levellists[Constants.Search_Data_Crm]:
		if overallResult==None:
			overallResult = rowData
			continue
		if logic==Constants.Search_And:
			overallResult.index.intersection_update(rowData.index)
			if len(overallResult.index)==0:
				break
		elif logic==Constants.Search_Or:
			overallResult.index.union_update(rowData.index)

  return [(None,None, contacthistoryid) for contacthistoryid in overallResult.index]

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION doCrmSearch(bytea) OWNER TO postgres;

-- Function: crmcount(integer)

-- DROP FUNCTION crmcount(integer);

CREATE OR REPLACE FUNCTION crmcount(p_searchcrmid integer)
  RETURNS SETOF searchsessionstatisticsext AS
$BODY$
DECLARE
	firstrow userdata.searchcrm%ROWTYPE;
	contacthistoryrow userdata.contacthistory%ROWTYPE;
	p_contacthistoryid bigint;
	p_searchcrmid integer;

BEGIN
	p_searchcrmid:=p_searchcrmid;

	SELECT INTO firstrow * FROM userdata.searchcrm AS s JOIN userdata.contacthistory AS ch ON ch.contacthistoryid=s.contacthistoryid WHERE s.searchcrmid = p_searchcrmid LIMIT 1;

	SELECT INTO contacthistoryrow * FROM userdata.contacthistory WHERE contacthistoryid = firstrow.contacthistoryid;

RETURN QUERY SELECT
	COUNT(*) as total,
	firstrow.contacthistoryid::bigint as contacthistoryid,
	firstrow.customerid as customerid
	FROM userdata.searchcrm AS s
	WHERE s.searchcrmid = p_searchcrmid;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION crmcount(integer) OWNER TO postgres;


ALTER TABLE clippingstore ADD COLUMN reach bigint;
ALTER TABLE userdata.contacthistory ADD COLUMN emailtemplateid integer;
ALTER TABLE userdata.contacthistory ADD FOREIGN KEY (emailtemplateid) REFERENCES userdata.emailtemplates (emailtemplateid) ON UPDATE NO ACTION ON DELETE SET NULL;


DROP FUNCTION web_to_html_link_address(text);

CREATE OR REPLACE FUNCTION Web_To_Html_Link_address(
win text
)
  RETURNS text

  AS $$
  w = win
  if w and not w.startswith("http:") and not w.startswith("https:"):
    w = "http://"  + w

  return w

$$ LANGUAGE plpythonu;

INSERT INTO research.fields VALUES (73, 'New Publisher');

UPDATE outlets SET circulationsourceid = 3
WHERE sourcetypeid = 7
AND circulation != 0
AND circulation is not null
AND circulationsourceid is null;

ALTER TABLE clippingstore ADD COLUMN alexainlinkscount bigint;
ALTER TABLE clippingstore ADD COLUMN alexapageviews bigint;
ALTER TABLE clippingstore ADD COLUMN alexarank bigint;
ALTER TABLE clippingstore ADD COLUMN alexareach bigint;


ALTER TABLE userdata.clippings ADD COLUMN reach bigint;

INSERT INTO internal.sourcetypes VALUES (12, 'Dutch');

INSERT INTO internal.emailservertype (emailservertypeid, emailservertypename) VALUES(3,'Open Relay 365');

ALTER TABLE internal.customers ALTER COLUMN confirmation_accepted SET DEFAULT true;
ALTER TABLE internal.customers ALTER COLUMN licence_start_date SET DEFAULT now();

CREATE TABLE internal.chartview
(
  chartviewid integer NOT NULL,
  chartviewdescription character varying(255),
  CONSTRAINT pk_chartviewid PRIMARY KEY (chartviewid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.chartview OWNER TO postgres;
GRANT ALL ON TABLE internal.chartview TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.chartview TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.chartview TO prmaxcontrol;

CREATE TABLE internal.dateranges
(
  daterangeid integer NOT NULL,
  daterangedescription character varying(255),
  CONSTRAINT pk_daterangeid PRIMARY KEY (daterangeid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.dateranges OWNER TO postgres;
GRANT ALL ON TABLE internal.dateranges TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dateranges TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dateranges TO prmaxcontrol;

CREATE TABLE internal.dashboardsettingsmode
(
  dashboardsettingsmodeid integer NOT NULL,
  dashboardsettingsmodedescription character varying(255),
  CONSTRAINT pk_dashboardsettingsmodeid PRIMARY KEY (dashboardsettingsmodeid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.dashboardsettingsmode OWNER TO postgres;
GRANT ALL ON TABLE internal.dashboardsettingsmode TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dashboardsettingsmode TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dashboardsettingsmode TO prmaxcontrol;

CREATE TABLE internal.dashboardsettingsstandard
(
  dashboardsettingsstandardid integer NOT NULL,
  dashboardsettingsstandarddescription character varying(255),
  CONSTRAINT pk_dashboardsettingsstandardid PRIMARY KEY (dashboardsettingsstandardid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.dashboardsettingsstandard OWNER TO postgres;
GRANT ALL ON TABLE internal.dashboardsettingsstandard TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dashboardsettingsstandard TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dashboardsettingsstandard TO prmaxcontrol;


CREATE TABLE internal.dashboardsettingsstandardsearchby
(
  dashboardsettingsstandardsearchbyid integer NOT NULL,
  dashboardsettingsstandardsearchbydescription character varying(255),
  CONSTRAINT pk_dashboardsettingsstandardsearchbyid PRIMARY KEY (dashboardsettingsstandardsearchbyid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.dashboardsettingsstandardsearchby OWNER TO postgres;
GRANT ALL ON TABLE internal.dashboardsettingsstandardsearchby TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dashboardsettingsstandardsearchby TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.dashboardsettingsstandardsearchby TO prmaxcontrol;


INSERT INTO internal.chartview VALUES (1, 'Pie Chart');
INSERT INTO internal.chartview VALUES (2, 'Lines Chart');
INSERT INTO internal.chartview VALUES (3, 'Columns Chart');

INSERT INTO internal.dateranges VALUES (1, 'Last Week');
INSERT INTO internal.dateranges VALUES (2, 'Last 2 Weeks');
INSERT INTO internal.dateranges VALUES (3, 'Last 3 Weeks');
INSERT INTO internal.dateranges VALUES (4, 'Last Month');
INSERT INTO internal.dateranges VALUES (5, 'Last 3 Months');
INSERT INTO internal.dateranges VALUES (6, 'Last 6 Months');
INSERT INTO internal.dateranges VALUES (7, 'Last 9 Months');
INSERT INTO internal.dateranges VALUES (8, 'Last Year');

INSERT INTO internal.dashboardsettingsmode VALUES (1, 'Standard');
INSERT INTO internal.dashboardsettingsmode VALUES (2, 'Global Analysis');

INSERT INTO internal.dashboardsettingsstandard VALUES (1, 'Channels');
INSERT INTO internal.dashboardsettingsstandard VALUES (2, 'Client');
INSERT INTO internal.dashboardsettingsstandard VALUES (3, 'Issue');

INSERT INTO internal.dashboardsettingsstandardsearchby VALUES (1, 'Nunber of clips');
INSERT INTO internal.dashboardsettingsstandardsearchby VALUES (2, 'Circulation');
INSERT INTO internal.dashboardsettingsstandardsearchby VALUES (3, 'EVA');

CREATE TABLE userdata.dashboardsettings
(
  customerid integer NOT NULL,
  windowid integer NOT NULL,
  dashboardsettingsmodeid integer NOT NULL,
  dashboardsettingsstandardid integer,
  dashboardsettingsstandardsearchbyid integer,
  questionid integer,
  by_client boolean DEFAULT false,
  clientid integer,
  by_issue boolean DEFAULT false,
  issueid integer,
  chartviewid integer NOT NULL DEFAULT 1,
  daterangeid integer NOT NULL DEFAULT 1,

  CONSTRAINT pk_customerid_windowod PRIMARY KEY (customerid, windowid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_dashboardsettingsmodeid FOREIGN KEY (dashboardsettingsmodeid)
      REFERENCES internal.dashboardsettingsmode (dashboardsettingsmodeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_dashboardsettingsstandardid FOREIGN KEY (dashboardsettingsstandardid)
      REFERENCES internal.dashboardsettingsstandard (dashboardsettingsstandardid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_dashboardsettingsstandardsearchbyid FOREIGN KEY (dashboardsettingsstandardsearchbyid)
      REFERENCES internal.dashboardsettingsstandardsearchby (dashboardsettingsstandardsearchbyid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_questionid FOREIGN KEY (questionid)
      REFERENCES userdata.questions (questionid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_clientid FOREIGN KEY (clientid)
      REFERENCES userdata.client (clientid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_issueid FOREIGN KEY (issueid)
      REFERENCES userdata.issues (issueid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_chartviewid FOREIGN KEY (chartviewid)
      REFERENCES internal.chartview (chartviewid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_dateranges FOREIGN KEY (daterangeid)
      REFERENCES internal.dateranges (daterangeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE userdata.dashboardsettings OWNER TO postgres;
GRANT ALL ON TABLE userdata.dashboardsettings TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.dashboardsettings TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.dashboardsettings TO prmaxcontrol;

