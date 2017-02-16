GRANT UPDATE ON SEQUENCE internal.publishers_publisherid_seq TO prmax;
INSERT INTO research.fields(fieldid, fieldname) VALUES (29, 'Publisher');
INSERT INTO research.fields(fieldid, fieldname) VALUES (30, 'Circulation Source');
INSERT INTO research.fields(fieldid, fieldname) VALUES (31, 'Circulation Dates');
INSERT INTO research.fields(fieldid, fieldname) VALUES (67, 'Web Browsers');
INSERT INTO research.fields(fieldid, fieldname) VALUES (68, 'Web Source');
INSERT INTO research.fields(fieldid, fieldname) VALUES (69, 'Web Dates');
INSERT INTO research.fields(fieldid, fieldname) VALUES (32, 'Price Type');

CREATE TABLE internal.circulationsource
(
   circulationsourceid serial NOT NULL,
   circulationsourcedesscription character varying NOT NULL,
   CONSTRAINT pk_circulationsource PRIMARY KEY (circulationsourceid)
)
WITH ( OIDS = FALSE);

GRANT SELECT,UPDATE,INSERT,DELETE ON internal.circulationsource TO prmax;
GRANT UPDATE ON SEQUENCE internal.circulationsource_circulationsourceid_seq TO PRMax;
GRANT INSERT,UPDATE,DELETE ON TABLE internal.publishers,internal.circulationauditdate TO prmax;

CREATE TABLE internal.websource
(
   websourceid serial NOT NULL,
   websourcedesscription character varying NOT NULL,
   CONSTRAINT pk_websource PRIMARY KEY (websourceid)
)
WITH ( OIDS = FALSE);

GRANT SELECT,UPDATE,INSERT,DELETE ON internal.websource TO prmax;
GRANT UPDATE ON SEQUENCE internal.websource_websourceid_seq TO PRMax;
GRANT INSERT,UPDATE,DELETE ON TABLE internal.publishers,internal.webauditdate TO prmax;


CREATE TABLE internal.webauditdate
(
  webauditdateid serial NOT NULL,
  webauditdatedescription character varying NOT NULL,
  CONSTRAINT fk_webauditdateid PRIMARY KEY (webauditdateid),
  CONSTRAINT un_webauditdate UNIQUE (webauditdatedescription)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.webauditdate OWNER TO postgres;
GRANT ALL ON TABLE internal.webauditdate TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.webauditdate TO prmax;
GRANT SELECT ON TABLE internal.webauditdate TO prmaxquestionnaires;

CREATE TABLE public.outletprofile
(
   outletid integer NOT NULL,
   cost smallint,
   readership character varying,
   editorialprofile text,
   nrsreadership character varying,
   jicregreadership character varying,
   subttitle text,
   officialjournalof character varying,
   incorporating character varying,
   deadline text,
   frequencynotes text,
   seriesparent integer,
   CONSTRAINT pk_outletprofile PRIMARY KEY (outletid),
   CONSTRAINT fk_outletid FOREIGN KEY (outletid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE CASCADE
) WITH (OIDS = FALSE);

GRANT SELECT,UPDATE,INSERT,DELETE ON outletprofile TO prmax;

CREATE TABLE cache.cacheprofile
(
   outletid integer NOT NULL,
   displayprofile bytea NOT NULL,
   CONSTRAINT pk_cacheprofile PRIMARY KEY (outletid),
   CONSTRAINT fk_outletid FOREIGN KEY (outletid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE CASCADE
) WITH (OIDS = FALSE);


GRANT SELECT,UPDATE,INSERT,DELETE ON cache.cacheprofile TO prmax;

CREATE TABLE queues.processqueue
(
   processqueueid serial,
   objectid integer,
   processid integer NOT NULL DEFAULT 1,
   CONSTRAINT pk_processqueue PRIMARY KEY (processqueueid)
) WITH ( OIDS = FALSE);

ALTER TABLE queues.processqueue ADD COLUMN statusid smallint NOT NULL DEFAULT 1;

GRANT SELECT,UPDATE,INSERT,DELETE ON queues.processqueue TO prmax;

ALTER TABLE outlets DROP COLUMN readership;
ALTER TABLE outlets DROP COLUMN editorialprofile;
ALTER TABLE outlets DROP COLUMN subtitles;
ALTER TABLE outlets DROP COLUMN officaljournalof;
ALTER TABLE outlets DROP COLUMN formerly;
ALTER TABLE outlets DROP COLUMN incorporating;

ALTER TABLE outlets ADD COLUMN circulationsourceid integer;
ALTER TABLE outlets ADD CONSTRAINT fk_circulationsourceid FOREIGN KEY (circulationsourceid) REFERENCES internal.circulationsource (circulationsourceid) ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE outlets ADD COLUMN websourceid integer;
ALTER TABLE outlets ADD CONSTRAINT fk_websourceid FOREIGN KEY (websourceid) REFERENCES internal.websource (websourceid) ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE outlets ADD COLUMN webbrowsers integer;
	 
ALTER TABLE outlets ADD COLUMN webauditdateid integer;
ALTER TABLE outlets ADD CONSTRAINT fk_webauditdateid FOREIGN KEY (webauditdateid) REFERENCES internal.webauditdate (webauditdateid)  ON UPDATE NO ACTION ON DELETE SET NULL;
	  
	  
INSERT INTO internal.searchtypes( searchtypeid, searchtypename) VALUES (6, 'Temp');

ALTER TABLE outletprofile DROP COLUMN seriesparent;
ALTER TABLE outletprofile ADD COLUMN seriesparentid integer;
ALTER TABLE outletprofile ADD COLUMN editionofid integer;
ALTER TABLE outletprofile ADD COLUMN supplementofid integer;
ALTER TABLE outletprofile ADD CONSTRAINT fk_seriesparentid FOREIGN KEY (seriesparentid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE outletprofile ADD CONSTRAINT fk_supplementofid FOREIGN KEY (supplementofid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE outletprofile ADD CONSTRAINT fk_editionofid FOREIGN KEY (editionofid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE SET NULL;

GRANT UPDATE ON SEQUENCE queues.processqueue_processqueueid_seq TO PRmax;

ALTER TABLE outletprofile ADD COLUMN broadcasttimes text;

ALTER TABLE internal.circulationsource RENAME circulationsourcedesscription  TO circulationsourcedescription;

GRANT UPDATE ON SEQUENCE internal.circulationauditdate_circulationauditdateid_seq TO prmax;

ALTER TABLE internal.websource RENAME websourcedesscription  TO websourcedescription;

GRANT UPDATE ON SEQUENCE internal.webauditdate_webauditdateid_seq TO prmax;

INSERT INTO internal.outletprices (outletpriceid,outletpricedescription) VALUES (1,'Unknown'),(2,'Paid'), (3, 'Free');
GRANT SELECT ON TABLE internal.outletprices to prmax;


CREATE TABLE internal.productioncompanies
(
   productioncompanyid serial NOT NULL,
   productioncompanydescription character varying NOT NULL,
   CONSTRAINT pk_productioncompanies PRIMARY KEY (productioncompanyid)
) WITH (OIDS = FALSE);

GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.productioncompanies TO prmax;
GRANT SELECT ON TABLE internal.productioncompanies TO prmaxquestionnaires;
GRANT SELECT ON employeeinterest_view TO prmaxquestionnaires;
GRANT SELECT ON interestwords, internal.prmax_outlettypes TO prmaxquestionnaires;
GRANT SELECT ON research.researchdetails TO prmaxquestionnaires;
GRANT SELECT ON outletcoverage,internal.geographical, internal.geographicallookuptypes TO prmaxquestionnaires;

GRANT UPDATE ON SEQUENCE internal.productioncompanies_productioncompanyid_seq TO prmax;

ALTER TABLE outletprofile ADD COLUMN productioncompanyid integer;
ALTER TABLE outletprofile ADD CONSTRAINT fk_productioncompanyid FOREIGN KEY (productioncompanyid) REFERENCES internal.productioncompanies (productioncompanyid) ON UPDATE NO ACTION ON DELETE SET NULL;

GRANT UPDATE ON SEQUENCE outletlanguages_outletlanguageid_seq TO prmax;

CREATE TABLE public.outlettooutlets
(
   outlettooutletid serial NOT NULL,
   typeid smallint NOT NULL,
   parentid integer NOT NULL,
   childid integer NOT NULL,
   CONSTRAINT fk_outlettooutlets PRIMARY KEY (outlettooutletid),
   CONSTRAINT fk_parentid FOREIGN KEY (parentid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE CASCADE,
   CONSTRAINT fk_childid FOREIGN KEY (childid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE CASCADE,
   CONSTRAINT "Un_outlettooutlets" UNIQUE (typeid, parentid, childid)
) WITH ( OIDS = FALSE);

GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE public.outlettooutlets TO prmax;
GRANT UPDATE ON SEQUENCE outlettooutlets_outlettooutletid_seq TO prmax;

ALTER TABLE queues.processqueue ADD COLUMN priority smallint NOT NULL DEFAULT 1;

ALTER TABLE research.researchdetails ADD COLUMN last_research_date date;
ALTER TABLE research.researchdetails ADD COLUMN last_questionaire_sent date;
ALTER TABLE research.researchprojects ADD COLUMN ismonthly boolean NOT NULL DEFAULT false;

insert into user_group(user_id,group_id) values(1,6),(600,6);

DROP VIEW employeerole_view;
CREATE OR REPLACE VIEW employeerole_view AS
 SELECT er.employeeid, e.customerid, r.prmaxrole AS rolename, er.prmaxroleid
   FROM employeeprmaxroles er
   LEFT JOIN employees e ON e.employeeid = er.employeeid
   LEFT JOIN internal.prmaxroles r ON er.prmaxroleid = r.prmaxroleid;
GRANT SELECT ON employeerole_view TO prmax;


CREATE ROLE prmaxquestionnaires LOGIN ENCRYPTED PASSWORD 'md586ab9f2c71f0644004e5f6d2babc746b'
   VALID UNTIL 'infinity';

GRANT USAGE ON SCHEMA internal,research TO prmaxquestionnaires;
GRANT SELECT ON TABLE outletlanguages,internal.languages,internal.prmax_outlettypes,internal.publishers,internal.circulationsource,internal.circulationauditdate,internal.websource,internal.webauditdate,interests,interestgroups,internal.frequencies ,internal.prmax_outlettypes,research.researchprojectitem,internal.countries,internal.vatcode,outlets, outletprofile, communications, addresses,internal.outletprices,employees,contacts  TO prmaxquestionnaires;

GRANT SELECT,UPDATE ON TABLE research.researchprojectitem TO prmaxquestionnaires;
GRANT SELECT,INSERT,UPDATE ON TABLE research.researchprojectchanges TO prmaxquestionnaires;

GRANT UPDATE ON SEQUENCE research.researchprojectchanges_researchprojectchangeid_seq TO prmaxquestionnaires;

INSERT INTO internal.reasoncodes (reasoncodeid,reasoncodedescription,reasoncategoryid) VALUES (27,'Questionnaire Changes' , 2 );

INSERT INTO research.fields(fieldid,fieldname) VALUES ( 33, 'Subtitle Name'),(34,'Incorporating'),(35,'Office Journal Of');

DROP TABLE research.externalchangerecorditem;
DROP TABLE research.externalchangerecord;

ALTER TABLE research.researchprojectchanges ALTER COLUMN fieldid DROP NOT NULL;
ALTER TABLE research.researchprojectchanges ADD COLUMN employeeid integer;
ALTER TABLE research.researchprojectchanges ADD CONSTRAINT fk_employeid FOREIGN KEY (employeeid) REFERENCES employees (employeeid) ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE research.researchprojectchanges ADD COLUMN actiontypeid integer;
ALTER TABLE research.researchprojectchanges  ALTER COLUMN value DROP NOT NULL;

INSERT INTO research.fields(fieldid,fieldname) VALUES (36,'Publisher'), (37,'Cost'),(38,'Readership');
INSERT INTO research.fields(fieldid,fieldname) VALUES (48,'Languages');
INSERT INTO research.fields(fieldid,fieldname) VALUES (49,'No Address');

ALTER TABLE outletprofile RENAME subttitle  TO subtitle;

ALTER TABLE research.researchprojectchanges ADD COLUMN display_1 character varying;
ALTER TABLE research.researchprojectchanges ADD COLUMN display_2 character varying;

ALTER TABLE research.researchprojectchanges  ADD COLUMN applied boolean NOT NULL DEFAULT false;

ALTER TABLE research.researchprojectitem ADD COLUMN expire_date date;

UPDATE internal.researchfrequencies SET researchfrequencyname = '1' WHERE researchfrequencyid = 5;
UPDATE internal.researchfrequencies SET researchfrequencyname = '4' WHERE researchfrequencyid = 4;
INSERT INTO internal.researchfrequencies (researchfrequencyid, researchfrequencyname) VALUES (7,'3'),(8,'2');

ALTER TABLE internal.prmax_outlettypes ADD COLUMN researchfrequencyid integer NOT NULL DEFAULT 1;
ALTER TABLE internal.prmax_outlettypes ADD CONSTRAINT fk_researchfrequencyid FOREIGN KEY (researchfrequencyid) REFERENCES internal.researchfrequencies (researchfrequencyid) ON UPDATE NO ACTION ON DELETE RESTRICT;

UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid= 15;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 16;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 4 WHERE prmax_outlettypeid = 1;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 4 WHERE prmax_outlettypeid = 2;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 4 WHERE prmax_outlettypeid = 3;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 4 WHERE prmax_outlettypeid = 4;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 4 WHERE prmax_outlettypeid = 5;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 7;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 8;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 9;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 11;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 12;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 13;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 14;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 18;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 47;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 17;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 48;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 19;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 20;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 22;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 63;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 41;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 27;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 25;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 26;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 28;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 40;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 29;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 30;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 31;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 32;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 33;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 34;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 35;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 46;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 36;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 37;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 3 WHERE prmax_outlettypeid = 43;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 44;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 38;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 39;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 45;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 42;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 49;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 23;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 21;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 64;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 65;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 24;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 2 WHERE prmax_outlettypeid = 66;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 50;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 52;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 53;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 54;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 55;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 56;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 57;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 58;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 59;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 60;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 61;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 1 WHERE prmax_outlettypeid = 62;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 67;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 5 WHERE prmax_outlettypeid = 68;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 7 WHERE prmax_outlettypeid = 6;
UPDATE internal.prmax_outlettypes SET researchfrequencyid = 8 WHERE prmax_outlettypeid = 10;

ALTER TABLE research.researchprojectchanges ALTER COLUMN actiontypeid SET DEFAULT 2;

INSERT INTO research.researchdetails( outletid,researchfrequencyid)
SELECT o.outletid,ot.researchfrequencyid
FROM outlets AS o
JOIN internal.prmax_outlettypes AS ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
WHERE o.customerid = -1 and o.outletid NOT IN (SELECT outletid from research.researchdetails);

UPDATE research.researchdetails AS rc
SET researchfrequencyid= ot.researchfrequencyid
FROM outlets AS o
JOIN internal.prmax_outlettypes AS ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
WHERE rc.outletid = o.outletid ;

ALTER TABLE internal.queryhistory ADD COLUMN typeid integer NOT NULL DEFAULT 0;
UPDATE internal.queryhistory SET typeid = 1 WHERE subject ilike '%research%';

INSERT INTO research.fields(fieldid, fieldname) VALUES (39, 'Frequency Notes');
INSERT INTO research.fields(fieldid, fieldname) VALUES (40,'nrsreadership');
INSERT INTO research.fields(fieldid, fieldname) VALUES (41,'jicregreadership');
INSERT INTO research.fields(fieldid, fieldname) VALUES (42,'deadline');
INSERT INTO research.fields(fieldid, fieldname) VALUES (43,'broadcasttimes');
INSERT INTO research.fields(fieldid, fieldname) VALUES (44,'Production Company');

INSERT INTO research.fields(fieldid, fieldname) VALUES (45,'Series Parent');
INSERT INTO research.fields(fieldid, fieldname) VALUES (46,'Supplement Of');
INSERT INTO research.fields(fieldid, fieldname) VALUES (47,'Edition Of');

GRANT INSERT,UPDATE,DELETE ON TABLE interestgroups TO prmax;

SELECT setval('internal.reasoncodes_reasoncodeid_seq', 28, true);

CREATE INDEX in_prmaxrolesynonyms_child
   ON internal.prmaxrolesynonyms (childprmaxroleid ASC NULLS LAST);


CREATE TABLE public.outletdesk
(
   outletdeskid serial NOT NULL,
   outletid integer NOT NULL,
   deskname character varying NOT NULL,
   CONSTRAINT pk_outletdeskid PRIMARY KEY (outletdeskid),
   CONSTRAINT fk_outletid FOREIGN KEY (outletid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE CASCADE,
   CONSTRAINT un_outletdeskkey UNIQUE (outletid, deskname)
)
WITH ( OIDS = FALSE );

GRANT INSERT,UPDATE,DELETE ON TABLE outletdesk TO prmax;

ALTER TABLE employees ADD COLUMN outletdeskid integer;
ALTER TABLE employees ADD CONSTRAINT fk_outletdesk FOREIGN KEY (outletdeskid) REFERENCES outletdesk (outletdeskid) ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE research.researchdetails ADD COLUMN researchdetailid serial NOT NULL;
ALTER TABLE research.researchdetails DROP CONSTRAINT pk_researchdetails;
ALTER TABLE research.researchdetails ADD CONSTRAINT pk_research_detailsid PRIMARY KEY (researchdetailid);

ALTER TABLE outlets  ADD COLUMN researchdetailid integer;
ALTER TABLE outlets  ADD CONSTRAINT fk_researchdetailid FOREIGN KEY (researchdetailid) REFERENCES research.researchdetails (researchdetailid) ON UPDATE NO ACTION ON DELETE CASCADE;

UPDATE internal.prmaxcontrol set search_index_disable_change = 1,debug_postgres_python=0;
UPDATE outlets AS o
SET researchdetailid = rd.researchdetailid
FROM research.researchdetails AS rd
WHERE rd.outletid = o.outletid;
UPDATE internal.prmaxcontrol set search_index_disable_change = 0,debug_postgres_python=0;

ALTER TABLE outletdesk ADD COLUMN communicationid integer;
ALTER TABLE outletdesk ADD COLUMN researchdetailid integer;
ALTER TABLE outletdesk  ADD CONSTRAINT fk_communicationid FOREIGN KEY (communicationid) REFERENCES communications (communicationid) ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE outletdesk  ADD CONSTRAINT fk_researchdetailid FOREIGN KEY (researchdetailid) REFERENCES research.researchdetails (researchdetailid) ON UPDATE NO ACTION ON DELETE CASCADE;

GRANT SELECT,DELETE,INSERT,UPDATE ON outletdesk to prmax;
GRANT UPDATE ON sequence outletdesk_outletdeskid_seq to prmax;

-- tidy up
update outlets set prmax_outlettypeid = 43 where prmax_outlettypeid = 36;
update outlets set prmax_outlettypeid = 44 where prmax_outlettypeid = 37;
delete from internal.prmax_outlettypes where prmax_outlettypeid in (36,37);

ALTER TABLE communications  ADD COLUMN blog character varying(85);
INSERT INTO research.fields(fieldid, fieldname) VALUES (50,'Blog');
INSERT INTO research.fields(fieldid, fieldname) VALUES (51,'Language 2');
INSERT INTO research.fields(fieldid, fieldname) VALUES (52,'Supplements');
INSERT INTO research.fields(fieldid, fieldname) VALUES (53,'Editions');
INSERT INTO research.fields(fieldid, fieldname) VALUES (54,'Coverage');
INSERT INTO research.fields(fieldid, fieldname) VALUES (55,'Research_Surname');
INSERT INTO research.fields(fieldid, fieldname) VALUES (56,'Research_Firstname' );
INSERT INTO research.fields(fieldid, fieldname) VALUES (57,'Research_Prefix' );
INSERT INTO research.fields(fieldid, fieldname) VALUES (58,'Research_Email' );
INSERT INTO research.fields(fieldid, fieldname) VALUES (59,'Research_Tel' );
INSERT INTO research.fields(fieldid, fieldname) VALUES (60,'Research_Job_Title' );

GRANT UPDATE ON SEQUENCE research.researchdetails_researchdetailid_seq  TO prmax;


UPDATE internal.researchfrequencies set researchfrequencyname = '5' WHERE researchfrequencyid = 2;
UPDATE internal.researchfrequencies set researchfrequencyname = '6' WHERE researchfrequencyid = 3;

CREATE OR REPLACE FUNCTION employee_research_force_delete(p_employeeid integer)
  RETURNS void AS
  $$
BEGIN

-- remove all links from the fixed lists
UPDATE userdata.listmembers SET employeeid = NULL
	FROM userdata.list AS l WHERE l.listid = userdata.listmembers.listid AND listtypeid = 2 AND userdata.listmembers.employeeid = p_employeeid AND l.fixed = true ;

-- removes any link left int the standard lists
DELETE FROM userdata.listmembers WHERE employeeid = p_employeeid;

-- now do the delete
EXECUTE employee_type_delete( p_employeeid ) ;


END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

DROP Index index_primaryemployeeid;
CREATE INDEX index_primaryemployeeid
  ON outlets
  USING btree
  (primaryemployeeid);

	ALTER TABLE queues.processqueue  ADD COLUMN priority integer NOT NULL DEFAULT 0;