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

ALTER TABLE internal.customers ADD COLUMN send_dist_through_prmax boolean NOT NULL DEFAULT true;
UPDATE internal.customers SET send_dist_through_prmax = True;

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