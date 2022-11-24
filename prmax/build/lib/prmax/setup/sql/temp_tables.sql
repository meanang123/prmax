ALTER TABLE ONLY internal.customers ALTER COLUMN collateral_size SET DEFAULT 1000;

-- drop table internal.marketsector;

CREATE TABLE internal.marketsector
(
  marketsectorid serial NOT NULL,
  marketsectordescription character varying(225) NOT NULL,
  CONSTRAINT pk_marketsectorid PRIMARY KEY (marketsectorid),
  CONSTRAINT pk_marketsectorid UNIQUE (marketsectorid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.marketsector OWNER TO postgres;
GRANT ALL ON TABLE internal.marketsector TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.marketsector TO prmax;
GRANT SELECT ON TABLE internal.marketsector TO prmaxquestionnaires;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.marketsector TO prmaxcontrol;

GRANT ALL ON TABLE internal.marketsector_marketsectorid_seq TO postgres;
GRANT UPDATE ON TABLE internal.marketsector_marketsectorid_seq TO prmax;
GRANT UPDATE ON TABLE internal.marketsector_marketsectorid_seq TO prmaxcontrol;

ALTER TABLE outlets ADD COLUMN marketsectorprimaryid integer;
ALTER TABLE outlets ADD COLUMN marketsectorsecondaryid integer;
ALTER TABLE outlets ADD COLUMN marketsectortertiaryid integer;

ALTER TABLE outlets ADD CONSTRAINT fk_marketsectorprimaryid FOREIGN KEY (marketsectorprimaryid) REFERENCES internal.marketsector(marketsectorid) MATCH SIMPLE;
ALTER TABLE outlets ADD CONSTRAINT fk_marketsectorsecondaryid FOREIGN KEY (marketsectorsecondaryid) REFERENCES internal.marketsector(marketsectorid) MATCH SIMPLE;
ALTER TABLE outlets ADD CONSTRAINT fk_marketsectortertiaryid FOREIGN KEY (marketsectortertiaryid) REFERENCES internal.marketsector(marketsectorid) MATCH SIMPLE;

--UPDATE outlets SET marketsectorprimaryid = -1;
--UPDATE outlets SET marketsectorsecondaryid = -1;
--UPDATE outlets SET marketsectortertiaryid = -1;

INSERT INTO research.fields VALUES (102, 'Primary Market Sector');
INSERT INTO research.fields VALUES (103, 'Secondary Market Sector');
INSERT INTO research.fields VALUES (104, 'Tertiary Market Sector');

/*

drop table twitter_userdetails;

CREATE TABLE twitter_userdetails
(
  objectid integer NOT NULL,
  objecttypeid integer NOT NULL,
  twitterlink character varying(225) NOT NULL,
  user_name character varying(50),
  profile_image_url character varying(128),
  CONSTRAINT pk_objectid PRIMARY KEY (objectid),
  CONSTRAINT pk_objectid UNIQUE (objectid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE twitter_userdetails OWNER TO postgres;
GRANT ALL ON TABLE twitter_userdetails TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE twitter_userdetails TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE twitter_userdetails TO prmaxcontrol;


--Direct Debit and monthly payments new expiry year
UPDATE internal.customers
SET licence_expire = licence_expire + interval '15 years'
WHERE customerstatusid = 2
AND paymentmethodid in (2,3)
AND licence_expire between '2020-01-01' and '2020-12-31'

UPDATE internal.customers
SET advance_licence_expired = advance_licence_expired + interval '15 years'
WHERE customerstatusid = 2
AND paymentmethodid in (2,3)
AND advance_licence_expired between '2020-01-01' and '2020-12-31'

UPDATE internal.customers
SET updatum_end_date = updatum_end_date + interval '15 years'
WHERE customerstatusid = 2
AND paymentmethodid in (2,3)
AND updatum_end_date between '2020-01-01' and '2020-12-31'
*/


-- ALTER TABLE internal.customers ADD COLUMN send_dist_through_prmax boolean NOT NULL DEFAULT true;
-- UPDATE internal.customers SET send_dist_through_prmax = True;

-- Function: searchoutletpublisher(integer, text, boolean, integer)

-- DROP FUNCTION searchoutletpublisher(integer, text, boolean, integer);

/*
-- Table: internal.researchprojectitemhistorytype

-- DROP TABLE internal.researchprojectitemhistorytype;
CREATE TABLE internal.researchprojectitemhistorytype
(
  researchprojectitemhistorytypeid integer NOT NULL,
  researchprojectitemhistorytypedescription character varying NOT NULL,

  CONSTRAINT researchprojectitemhistorytype_pkey PRIMARY KEY (researchprojectitemhistorytypeid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.researchprojectitemhistorytype OWNER TO postgres;
GRANT ALL ON TABLE internal.researchprojectitemhistorytype TO postgres;
GRANT ALL ON TABLE internal.researchprojectitemhistorytype TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.researchprojectitemhistorytype TO prmaxcontrol;

-- Table: research.researchprojectitemhistory

-- DROP TABLE research.researchprojectitemhistory;

CREATE TABLE research.researchprojectitemhistory
(
  researchprojectitemhistoryid serial NOT NULL,
  researchprojectitemhistorynotes character varying,
  researchprojectitemhistorytypeid integer NOT NULL,
  researchprojectitemid integer NOT NULL,
  owner_id integer NOT NULL,
  follow_up_view_check boolean DEFAULT false,
  follow_up_date date,
  follow_up_owner_id integer,
  follow_up_reason character varying,
  researchprojectitemhistorydate date DEFAULT now(),

  CONSTRAINT researchprojectitemhistory_pkey PRIMARY KEY (researchprojectitemhistoryid),
  CONSTRAINT researchprojectitemhistory_ownerid_fkey FOREIGN KEY (owner_id)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT researchprojectitemhistory_follow_up_ownerid_fkey FOREIGN KEY (follow_up_owner_id)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT fk_researchprojectitemid FOREIGN KEY (researchprojectitemid)
      REFERENCES research.researchprojectitem (researchprojectitemid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT fk_researchprojectitemhistorytypeid FOREIGN KEY (researchprojectitemhistorytypeid)
      REFERENCES internal.researchprojectitemhistorytype (researchprojectitemhistorytypeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT
)
WITH (
  OIDS=FALSE
);
ALTER TABLE research.researchprojectitemhistory OWNER TO postgres;
GRANT ALL ON TABLE research.researchprojectitemhistory TO postgres;
GRANT ALL ON TABLE research.researchprojectitemhistory TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE research.researchprojectitemhistory TO prmaxcontrol;

GRANT ALL ON TABLE research.researchprojectitemhistory_researchprojectitemhistoryid_seq TO postgres;
GRANT UPDATE ON TABLE research.researchprojectitemhistory_researchprojectitemhistoryid_seq TO prmax;
GRANT UPDATE ON TABLE research.researchprojectitemhistory_researchprojectitemhistoryid_seq TO prmaxcontrol;

INSERT INTO internal.researchprojectitemhistorytype VALUES (1, 'Telephone');
INSERT INTO internal.researchprojectitemhistorytype VALUES (2, 'Email');
INSERT INTO internal.researchprojectitemhistorytype VALUES (3, 'Phone and Email');
INSERT INTO internal.researchprojectitemhistorytype VALUES (4, 'Website');
INSERT INTO internal.researchprojectitemhistorytype VALUES (5, 'Other');


ALTER TABLE research.researchprojectitem ADD COLUMN owner_id integer ;
ALTER TABLE research.researchprojectitem ADD CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES tg_user (user_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;

INSERT INTO internal.reportsource VALUES (18, 'Projects');
INSERT INTO internal.reporttemplates VALUES (36, -1, 'Projects Report', '<queries><query type="CUSTOM"></query></queries>', '', 18, 'ProjectReport');

UPDATE internal.researchprojectstatus SET researchprojectstatusdescription = 'Phone Follow Up' WHERE researchprojectstatusid = 9;
UPDATE internal.researchprojectstatus SET researchprojectstatusdescription = 'Non-Responder' WHERE researchprojectstatusid = 10;

ALTER TABLE tg_user ADD COLUMN isuserresearcher boolean NOT NULL DEFAULT false;
UPDATE tg_user SET isuserresearcher = false;

ALTER TABLE research.researchprojectitemhistory ALTER COLUMN owner_id DROP NOT NULL;

INSERT INTO internal.customertypes VALUES (26, 'Press Office', '', 5, 14);

UPDATE internal.researchprojectitemhistorytype SET researchprojectitemhistorytypedescription = 'Email - Incoming' WHERE researchprojectitemhistorytypeid = 2;
UPDATE internal.researchprojectitemhistorytype SET researchprojectitemhistorytypedescription = 'Email - Outgoing' WHERE researchprojectitemhistorytypeid = 3;

ALTER TABLE research.researchprojectitemhistory ADD COLUMN researchprojectitemhistorydescription character varying(80);

--- drop table research.researchprojectitememail
CREATE TABLE research.researchprojectitememail
(
  researchprojectitememailid serial NOT NULL,
  researchprojectitemid integer NOT NULL,
  researchprojectitemhistoryid integer NOT NULL,
  researchprojectitemhistorytypeid integer NOT NULL,
  researchprojectitememailfrom character varying NOT NULL,
  researchprojectitememailto character varying NOT NULL,
  researchprojectitememailsubject character varying,
  researchprojectitememailbody character varying,
  researchprojectitememaildate date DEFAULT now(),

  CONSTRAINT researchprojectitememail_pkey PRIMARY KEY (researchprojectitememailid),
  CONSTRAINT fk_researchprojectitemid_fkey FOREIGN KEY (researchprojectitemid)
      REFERENCES research.researchprojectitem (researchprojectitemid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT fk_researchprojectitemhistoryid_fkey FOREIGN KEY (researchprojectitemhistoryid)
      REFERENCES research.researchprojectitemhistory (researchprojectitemhistoryid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT fk_researchprojectitemhistorytypeid FOREIGN KEY (researchprojectitemhistorytypeid)
      REFERENCES internal.researchprojectitemhistorytype (researchprojectitemhistorytypeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT
)
WITH (
  OIDS=FALSE
);
ALTER TABLE research.researchprojectitememail OWNER TO postgres;
GRANT ALL ON TABLE research.researchprojectitememail TO postgres;
GRANT ALL ON TABLE research.researchprojectitememail TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE research.researchprojectitememail TO prmaxcontrol;

GRANT ALL ON TABLE research.researchprojectitememail_researchprojectitememailid_seq TO postgres;
GRANT UPDATE ON TABLE research.researchprojectitememail_researchprojectitememailid_seq TO prmax;
GRANT UPDATE ON TABLE research.researchprojectitememail_researchprojectitememailid_seq TO prmaxcontrol;

ALTER TABLE research.researchdetails ADD COLUMN italian_export boolean NOT NULL DEFAULT false;
ALTER TABLE research.researchdetailsdesk ADD COLUMN italian_export boolean NOT NULL DEFAULT false;
INSERT INTO research.fields(fieldid,fieldname) VALUES(101,'Italian Export');

ALTER TABLE outlets ADD COLUMN italian_export boolean NOT NULL DEFAULT false;
ALTER TABLE research.researchdetails DROP COLUMN italian_export;
ALTER TABLE research.researchdetailsdesk DROP COLUMN italian_export;

INSERT INTO internal.reasoncodes VALUES (31, 'Project Changes', 2);
INSERT INTO internal.reasoncodes VALUES (32, 'Project Item Changes', 2);

INSERT INTO internal.reasoncodes VALUES (31, 'Project Changes', 2);
INSERT INTO internal.reasoncodes VALUES (32, 'Project Item Changes', 2);

INSERT INTO internal.objecttypes VALUES (10, 'Project');
INSERT INTO internal.objecttypes VALUES (11, 'Project Item Status');
INSERT INTO internal.objecttypes VALUES (12, 'Project Item');
INSERT INTO internal.objecttypes VALUES (13, 'Project Item History');

INSERT INTO research.fields VALUES (107, 'Project Item Status');
INSERT INTO research.fields VALUES (102, 'Project Item History');
INSERT INTO research.fields VALUES (103, 'Project Item History Type');
INSERT INTO research.fields VALUES (104, 'Project Item History Description');
INSERT INTO research.fields VALUES (105, 'Project Item History Notes');
INSERT INTO research.fields VALUES (106, 'Project Item Owner');


ALTER TABLE research.activity ADD COLUMN researchprojectid integer;

INSERT INTO internal.actiontypes VALUES (10, 'Received');

INSERT INTO internal.researchprojectitemhistorytype VALUES (6, 'Research complete');
INSERT INTO internal.researchprojectitemhistorytype VALUES (7, 'Updates in email');
INSERT INTO internal.researchprojectitemhistorytype VALUES (8, 'Q unresponsive - Not true');
INSERT INTO internal.researchprojectitemhistorytype VALUES (9, 'Q unresponsive - True');
INSERT INTO internal.researchprojectitemhistorytype VALUES (10, 'Outlet ceased - Taking a break');
INSERT INTO internal.researchprojectitemhistorytype VALUES (11, 'Outlet in transition');
INSERT INTO internal.researchprojectitemhistorytype VALUES (12, 'IP wanted more info');
INSERT INTO internal.researchprojectitemhistorytype VALUES (13, 'Outlet not policy');
INSERT INTO internal.researchprojectitemhistorytype VALUES (14, 'Out of office - auto reply');
INSERT INTO internal.researchprojectitemhistorytype VALUES (15, 'Email bounced');
INSERT INTO internal.researchprojectitemhistorytype VALUES (16, 'Received by IP - working on it');
INSERT INTO internal.researchprojectitemhistorytype VALUES (17, 'IP wont click link');
INSERT INTO internal.researchprojectitemhistorytype VALUES (18, 'Unclear who IP is');
INSERT INTO internal.researchprojectitemhistorytype VALUES (19, 'Delisting request - outlet');
INSERT INTO internal.researchprojectitemhistorytype VALUES (20, 'Delisting request - contact');
INSERT INTO internal.researchprojectitemhistorytype VALUES (21, 'Send to somebody else');
INSERT INTO internal.researchprojectitemhistorytype VALUES (22, 'Promotional - Media pack');
INSERT INTO internal.researchprojectitemhistorytype VALUES (23, 'Add outlet - related outlets');
INSERT INTO internal.researchprojectitemhistorytype VALUES (24, 'Mystery email');
INSERT INTO internal.researchprojectitemhistorytype VALUES (25, 'Do not send emails');
INSERT INTO internal.researchprojectitemhistorytype VALUES (26, 'Update frequency inappropriate');
INSERT INTO internal.researchprojectitemhistorytype VALUES (27, 'Just look at the website');

ALTER TABLE employees ADD COLUMN tracked boolean NOT NULL DEFAULT false;

ALTER TABLE research.researchprojectitemhistory ALTER COLUMN researchprojectitemhistorydescription type character varying;


--------
ALTER TABLE internal.prmaxcosts ADD COLUMN editionid integer NOT NULL DEFAULT 0;
ALTER TABLE internal.prmaxcosts ADD COLUMN mediadataid integer NOT NULL DEFAULT 0;
ALTER TABLE internal.prmaxcosts ADD COLUMN paymentmethodid integer NOT NULL DEFAULT 4;

ALTER TABLE internal.prmaxcosts DROP CONSTRAINT pk_terms;
ALTER TABLE internal.prmaxcosts ADD CONSTRAINT pk_terms PRIMARY KEY (termid, nbrofloginsid, editionid, mediadataid, paymentmethodid);

DELETE FROM internal.prmaxcosts;

INSERT INTO internal.prmaxcosts VALUES (4, 1,187800,37560,225360, 30000,6000,36000,0,0,0,0,0,0,0,0,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,355000,71000,426000, 30000,6000,36000,0,0,0,0,0,0,1,0,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,115500,23100,138600, 30000,6000,36000,0,0,0,0,0,0,2,0,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,256000,51200,307200, 30000,6000,36000,0,0,0,0,0,0,0,1,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,484000,96800,580800, 30000,6000,36000,0,0,0,0,0,0,1,1,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,189500,37900,227400, 30000,6000,36000,0,0,0,0,0,0,2,1,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,308500,61700,370200, 30000,6000,36000,0,0,0,0,0,0,0,2,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,584500,116900,701400, 30000,6000,36000,0,0,0,0,0,0,1,2,4);
INSERT INTO internal.prmaxcosts VALUES (4, 1,256000,51200,307200, 30000,6000,36000,0,0,0,0,0,0,2,2,4);

INSERT INTO internal.prmaxcosts VALUES (4, 1,18800,3760,22560, 30000/12,6000/12,36000/12,0,0,0,0,0,0,0,0,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,35500,7100,42600, 30000/12,6000/12,36000/12,0,0,0,0,0,0,1,0,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,11500,2300,13800, 30000/12,6000/12,36000/12,0,0,0,0,0,0,2,0,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,25600,5120,30720, 30000/12,6000/12,36000/12,0,0,0,0,0,0,0,1,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,48400,9680,58080, 30000/12,6000/12,36000/12,0,0,0,0,0,0,1,1,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,18900,37800,22680, 30000/12,6000/12,36000/12,0,0,0,0,0,0,2,1,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,30800,61600,36960, 30000/12,6000/12,36000/12,0,0,0,0,0,0,0,2,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,58000,11600,69600, 30000/12,6000/12,36000/12,0,0,0,0,0,0,1,2,2);
INSERT INTO internal.prmaxcosts VALUES (4, 1,25600,5120,30720, 30000/12,6000/12,36000/12,0,0,0,0,0,0,2,2,2);

INSERT INTO internal.prmaxcosts VALUES (1, 1,19500,3900,23400, 30000/12,6000/12,36000/12,0,0,0,0,0,0,2,0,4);

INSERT INTO internal.researchprojectstatus VALUES (13, 'Response Handling');
*/


