/*
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


UPDATE internal.outletsearchtypes SET outletsearchtypename = 'B2B Magazines' WHERE outletsearchtypeid = 4;

-- missing index
CREATE INDEX ON userdata.clippings (customerid ASC NULLS LAST, created_date ASC NULLS LAST);

INSERT INTO internal.prmax_outlettypes (prmax_outlettypeid,prmax_outlettypename,outletsearchtypeid, prmax_outletgroupid) VALUES(75,'Podcast',8, 'internet');

INSERT INTO internal.outletsearchtypes VALUES('Private Media Channels', 13);

ALTER TABLE internal.prmax_outlettypes ADD COLUMN customerid integer NOT NULL DEFAULT -1;
ALTER TABLE internal.prmax_outlettypes ADD CONSTRAINT fk_customerid FOREIGN KEY (customerid) REFERENCES internal.customers (customerid) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE RESTRICT;

ALTER TABLE internal.prmax_outlettypes DROP CONSTRAINT un_prmax_outlettypename;
ALTER TABLE internal.prmax_outlettypes ADD CONSTRAINT un_prmax_outlettypename UNIQUE (prmax_outlettypename, customerid);

UPDATE internal.prmax_outlettypes SET customerid = -1;

UPDATE internal.outletprices SET outletpricedescription = '' WHERE outletpriceid = 1;

-- ALTER TABLE internal.customers ADD COLUMN send_dist_through_prmax boolean NOT NULL DEFAULT true;
-- UPDATE internal.customers SET send_dist_through_prmax = True;

-- Function: searchoutletpublisher(integer, text, boolean, integer)

-- DROP FUNCTION searchoutletpublisher(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchoutletpublisher(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS bytea AS
$BODY$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doOutletPublisher

	return DBCompress.encode(doOutletPublisher(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchoutletpublisher(integer, text, boolean, integer) OWNER TO postgres;


-- Function: searchoutletprofilecount(integer, text, boolean, integer)

-- DROP FUNCTION searchoutletprofilecount(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchoutletpublishercount(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS integer AS
$BODY$

	from prmax.utilities.search import doOutletPublisher

	return len(doOutletPublisher(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchoutletpublishercount(integer, text, boolean, integer) OWNER TO postgres;


-- Function: searchemployeecontactext(integer, text, boolean, integer)

-- DROP FUNCTION searchemployeecontactext(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchfreelancecontactext(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS bytea AS
$BODY$

    from ttl.plpython import DBCompress
    from prmax.utilities.search import SearchFreelanceContactExt

    return DBCompress.encode(SearchFreelanceContactExt(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchfreelancecontactext(integer, text, boolean, integer) OWNER TO postgres;

-- Function: searchemployeecontactextcount(integer, text, boolean, integer)

-- DROP FUNCTION searchemployeecontactextcount(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchfreelancecontactextcount(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS integer AS
$BODY$

    from prmax.utilities.search import SearchFreelanceContactExt

    return len(SearchFreelanceContactExt(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchfreelancecontactextcount(integer, text, boolean, integer) OWNER TO postgres;


INSERT INTO research.fields VALUES (74, 'Source');
INSERT INTO research.fields VALUES (75, 'Month1');
INSERT INTO research.fields VALUES (76, 'Month2');
INSERT INTO research.fields VALUES (77, 'Month3');
INSERT INTO research.fields VALUES (78, 'Month4');
INSERT INTO research.fields VALUES (79, 'Research Details Required');

INSERT INTO research.fields VALUES (80, 'Editorial Month Only');
INSERT INTO research.fields VALUES (81, 'Editorial Date');
INSERT INTO research.fields VALUES (82, 'Editorial Description');
INSERT INTO research.fields VALUES (83, 'Cover Month Only');
INSERT INTO research.fields VALUES (84, 'Cover Date');
INSERT INTO research.fields VALUES (85, 'Cover Description');
INSERT INTO research.fields VALUES (86, 'Publication Date Month Only');
INSERT INTO research.fields VALUES (87, 'Publication Date');
INSERT INTO research.fields VALUES (88, 'Publication Date Description');
INSERT INTO research.fields VALUES (89, 'Feature Description');
INSERT INTO research.fields VALUES (90, 'Feature Summary');
INSERT INTO research.fields VALUES (91, 'Feature Contact');
INSERT INTO research.fields VALUES (92, 'Feature Interest');
INSERT INTO research.fields VALUES (93, 'Feature Research Outlet Status');
INSERT INTO research.fields VALUES (94, 'Feature Research Date');
INSERT INTO research.fields VALUES (95, 'Feature Research URL');
INSERT INTO research.fields VALUES (96, 'Feature Research Info');
INSERT INTO research.fields VALUES (97, 'Last Questionaire Sent');
INSERT INTO research.fields VALUES (98, 'Last Researched Completed');
INSERT INTO research.fields VALUES (99, 'Research Notes');


UPDATE research.fields SET fieldname = 'Job Role' WHERE fieldid = 32;

INSERT INTO internal.objecttypes VALUES (9, 'Desk');

UPDATE contacts SET sourcetypeid = 2 WHERE sourcetypeid = 1;
UPDATE employees SET sourcetypeid = 2 WHERE sourcetypeid = 1;


-- Function: searchemployeecontactfullext(integer, text, boolean, integer)

-- DROP FUNCTION searchemployeecontactfullext(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchemployeecontactfullext(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS bytea AS
$BODY$

    from ttl.plpython import DBCompress
    from prmax.utilities.search import SearchEmployeeContactFullExt

    return DBCompress.encode(SearchEmployeeContactFullExt(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchemployeecontactfullext(integer, text, boolean, integer) OWNER TO postgres;

-- Function: searchemployeecontactextcount(integer, text, boolean, integer)

-- DROP FUNCTION searchemployeecontactextcount(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchemployeecontactfullextcount(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS integer AS
$BODY$

    from prmax.utilities.search import SearchEmployeeContactFullExt

    return len(SearchEmployeeContactFullExt(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchemployeecontactfullextcount(integer, text, boolean, integer) OWNER TO postgres;


UPDATE internal.sortorder
SET sortorderfieldname = 'UPPER(countryname) %order%, UPPER(sortname) %order%'
WHERE sortorderid = 7;


UPDATE employeeinterests SET employeeprmaxroleid = null where employeeprmaxroleid is not null;
DROP TRIGGER outletprmaxroles_update ON employeeprmaxroles;
DROP TRIGGER outletprmaxroles_delete ON employeeprmaxroles;
DROP TRIGGER outletprmaxroles_add ON employeeprmaxroles;

INSERT INTO internal.reportsource VALUES (17, 'Clippings Standard');
INSERT INTO internal.reporttemplates VALUES (35, -1, 'Clippings Standard Report', '<queries><query type="CUSTOM"></query></queries>', '', 17, 'ClippingsStdReport');



-- Table: internal.deletionhistorytype

-- DROP TABLE internal.deletionhistorytype;
CREATE TABLE internal.deletionhistorytype
(
  deletionhistorytypeid integer NOT NULL,
  deletionhistorytypedescription character varying NOT NULL,

  CONSTRAINT deletionhistorytype_pkey PRIMARY KEY (deletionhistorytypeid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.deletionhistorytype OWNER TO postgres;
GRANT ALL ON TABLE internal.deletionhistorytype TO postgres;
GRANT ALL ON TABLE internal.deletionhistorytype TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.deletionhistorytype TO prmaxcontrol;



-- Table: userdata.deletionhistory

-- DROP TABLE userdata.deletionhistory;

CREATE TABLE userdata.deletionhistory
(
  deletionhistoryid serial NOT NULL,
  deletionhistorydescription character varying,
  outletname character varying(255),
  firstname character varying(255),
  familyname character varying(255),
  domain character varying(255),
  researchprojectid integer,
  reasoncodeid integer NOT NULL,
  deletionhistorytypeid integer NOT NULL,
  userid integer NOT NULL,
  deletiondate date DEFAULT now(),


  CONSTRAINT deletionhistory_pkey PRIMARY KEY (deletionhistoryid),
  CONSTRAINT deletionhistory_userid_fkey FOREIGN KEY (userid)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT fk_researchprojectid FOREIGN KEY (researchprojectid)
      REFERENCES research.researchprojects (researchprojectid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT fk_reasoncodeid FOREIGN KEY (reasoncodeid)
      REFERENCES internal.reasoncodes (reasoncodeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT fk_deletionhistorytype FOREIGN KEY (deletionhistorytypeid)
      REFERENCES internal.deletionhistorytype (deletionhistorytypeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT
)
WITH (
  OIDS=FALSE
);
ALTER TABLE userdata.deletionhistory OWNER TO postgres;
GRANT ALL ON TABLE userdata.deletionhistory TO postgres;
GRANT ALL ON TABLE userdata.deletionhistory TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.deletionhistory TO prmaxcontrol;

GRANT ALL ON TABLE userdata.deletionhistory_deletionhistoryid_seq TO postgres;
GRANT UPDATE ON TABLE userdata.deletionhistory_deletionhistoryid_seq TO prmax;
GRANT UPDATE ON TABLE userdata.deletionhistory_deletionhistoryid_seq TO prmaxcontrol;

INSERT INTO internal.deletionhistorytype VALUES (1, 'Outlet');
INSERT INTO internal.deletionhistorytype VALUES (2, 'Freelance');
INSERT INTO internal.deletionhistorytype VALUES (3, 'Contact');

INSERT INTO internal.reasoncategories VALUES (8, 'Deletion History');
INSERT INTO internal.reasoncodes VALUES (29, 'Outlet request to remove', 8);
INSERT INTO internal.reasoncodes VALUES (30, 'Contact request to remove', 8);

INSERT INTO research.fields VALUES (100, 'New Publisher Name');

INSERT INTO internal.dashboardsettingsstandard VALUES (4, 'Tone');

GRANT SELECT ON TABLE internal.prmaxdatasetcountries TO prmaxquestionnaires;


ALTER TABLE employees ADD COLUMN countryid integer;
ALTER TABLE employees ADD CONSTRAINT fk_countryid FOREIGN KEY (countryid) REFERENCES internal.countries (countryid) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE RESTRICT;

UPDATE employees SET countryid = (SELECT countryid FROM outlets AS o WHERE o.outletid = employees.outletid);

ALTER TABLE contacts ADD COLUMN countryid integer;
ALTER TABLE contacts ADD CONSTRAINT fk_countryid FOREIGN KEY (countryid) REFERENCES internal.countries (countryid) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE RESTRICT;

ALTER TABLE userdata.deletionhistory ADD COLUMN objectid integer NOT NULL;
ALTER TABLE research.researchprojectitem DROP CONSTRAINT fk_outletid;

ALTER TABLE userdata.deletionhistory DROP COLUMN outletname;
ALTER TABLE userdata.deletionhistory ADD COLUMN outlet_name character varying(255);

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

*/

ALTER TABLE internal.publishers DROP CONSTRAINT un_publisher;
ALTER TABLE internal.publishers ADD CONSTRAINT un_publisher UNIQUE (publishername, countryid);

UPDATE employees SET countryid = (SELECT countryid FROM outlets AS o WHERE o.outletid = employees.outletid)
WHERE employees.countryid is null;

ALTER TABLE research.researchdetails ADD COLUMN italian_export boolean NOT NULL DEFAULT false;
ALTER TABLE research.researchdetailsdesk ADD COLUMN italian_export boolean NOT NULL DEFAULT false;
INSERT INTO research.fields(fieldid,fieldname) VALUES(101,'Italian Export');

-- UPDATE research.researchdetails
-- SET italian_export = true
-- WHERE outletid in ( SELECT outletid from outlets where customerid = -1 and countryid in (1,113));
