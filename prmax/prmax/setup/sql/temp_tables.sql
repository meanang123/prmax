-- 17/10/2016 all upove on live

ALTER TABLE research.outlet_external_links ADD COLUMN url character varying;
ALTER TABLE userdata.emailtemplateslinkthrough ADD COLUMN nbrclick integer NOT NULL DEFAULT 0;
INSERT INTO internal.sourcetypes VALUES (7, 'USA');

ALTER TABLE employees ADD COLUMN synchroniseid integer;

ALTER TABLE research.researchdetails ADD COLUMN no_sync boolean DEFAULT false;
ALTER TABLE research.researchdetails ADD COLUMN last_sync timestamp;

INSERT INTO research.fields(fieldid, fieldname) VALUES (71, 'Do not synchronise');

ALTER TABLE accounts.pricecodes ADD COLUMN customersourceid integer;


CREATE TABLE internal.customerproducts
(
  customerproductid serial NOT NULL,
  customerproductdescription character varying NOT NULL,
  CONSTRAINT pk_customerproduct PRIMARY KEY (customerproductid),
  CONSTRAINT un_customerproduct UNIQUE (customerproductdescription)
)
WITH (OIDS=FALSE);

ALTER TABLE internal.customerproducts OWNER TO postgres;
GRANT ALL ON TABLE internal.customerproducts TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.customerproducts TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.customerproducts TO prmaxcontrol;
GRANT UPDATE ON SEQUENCE internal.customerproducts_customerproductid_seq TO prmaxcontrol;

INSERT INTO internal.customerproducts VALUES (1, 'Freelance');
INSERT INTO internal.customerproducts VALUES (2, 'Standard');
INSERT INTO internal.customerproducts VALUES (3, 'Professional');

ALTER TABLE accounts.pricecodes ADD COLUMN customerproductid integer;
ALTER TABLE accounts.pricecodes ADD CONSTRAINT fk_customerproductid FOREIGN KEY (customerproductid) REFERENCES internal.customerproducts (customerproductid)  ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE accounts.pricecodes DROP CONSTRAINT un_pricecode;
ALTER TABLE accounts.pricecodes ADD CONSTRAINT un_pricecode  UNIQUE (pricecodedescription, prmaxmoduleid, customerproductid, customersourceid);

ALTER TABLE seoreleases.seorelease
   ALTER COLUMN twitter TYPE varchar(90),
    ALTER COLUMN facebook TYPE varchar(90),
    ALTER COLUMN www TYPE varchar(90);

CREATE TABLE internal.hostspf
(
	host character varying(120),
	checked_date timestamp without time zone,
	is_valid_source boolean NOT NULL DEFAULT false,
	PRIMARY KEY (host)
) WITH (OIDS = FALSE);


GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.hostspf TO prmax;

insert into internal.customersources(customersourceid, customersourcedescription) VALUES(14,'MyNewsdesk');
UPDATE internal.customers SET customersourceid = 7 where customertypeid = 2;
UPDATE internal.customers SET customersourceid = 12 where customertypeid = 15;
UPDATE internal.customers SET customersourceid = 14 where customertypeid = 19;

ALTER TABLE internal.clippingsorder	ADD COLUMN has_been_deleted boolean NOT NULL DEFAULT false;


INSERT INTO internal.reporttemplates VALUES (27,-1, 'Outlet Details Report', E'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Outlet Name,Contact Name,Contact Job Title,Outlet Email,Outlet Tel,Profile,Readership,Publisher/Broadcaster,NRS,JICREG,Circulation date,Circulation source,Web browsers,Web source,Web date,Country">SELECT JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN \'\' ELSE o.outletname END)as outletname, JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,\'\')) as contactname, e.job_title, get_override(oc_c.email,com.email) as email, get_override(oc_c.tel,com.tel) as tel, CASE WHEN o.profile is NULL THEN \'\' ELSE o.profile END as profile,pub.publishername, op.readership, op.nrsreadership, op.jicregreadership, ca.circulationauditdatedescription, cs.circulationsourcedescription, o.webbrowsers, wa.webauditdatedescription, ws.websourcedescription,country.countryname FROM userdata.searchsession as s JOIN outlets as o on o.outletid = s.outletid LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid LEFT OUTER JOIN contacts as c on e.contactid = c.contactid LEFT OUTER JOIN communications AS com ON o.communicationid = com.communicationid LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid  LEFT OUTER JOIN internal.countries AS country ON country.countryid = o.countryid LEFT OUTER JOIN outletprofile AS op ON o.outletid = op.outletid LEFT OUTER JOIN internal.circulationauditdate AS ca ON o.circulationauditdateid = ca.circulationauditdateid LEFT OUTER JOIN internal.circulationsource AS cs ON o.circulationsourceid = cs.circulationsourceid LEFT OUTER JOIN internal.websource AS ws ON o.websourceid = ws.websourceid LEFT OUTER JOIN internal.webauditdate AS wa ON o.webauditdateid = wa.webauditdateid LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid WHERE s.userid = %(userid)s  and s.searchtypeid= %(searchtypeid)s  AND SELECTION(s.selected, %(selector)s)=true  ORDER BY outletname </query></queries>','',3,'');

UPDATE internal.reporttemplates SET
query_text = E'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Outlet Name,Outlet Email,Outlet Tel,Contact Name,Contact Job Title,Outlet Address,Profile,Readership,Publisher/Broadcaster,NRS,JICREG,Circulation,Circulation date,Circulation source,Web browsers,Web source,Web date,Country">SELECT JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN \'\' ELSE o.outletname END)as outletname, com.email, com.tel, JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname, e.job_title, JSON_ENCODE(addressfull(a.address1,a.address2,a.county,a.postcode,null, a.townname)) as address,op.editorialprofile,op.readership, pub.publishername, op.nrsreadership, op.jicregreadership, CASE WHEN o.circulation = 0 THEN null ELSE o.circulation END as circulation, ca.circulationauditdatedescription, cs.circulationsourcedescription, o.webbrowsers, wa.webauditdatedescription, ws.websourcedescription,country.countryname FROM userdata.searchsession as s JOIN outlets as o on o.outletid = s.outletid LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid LEFT OUTER JOIN contacts as c on e.contactid = c.contactid LEFT OUTER JOIN internal.countries AS country ON country.countryid = o.countryid LEFT OUTER JOIN communications AS com ON o.communicationid = com.communicationid LEFT OUTER JOIN outletprofile AS op ON o.outletid = op.outletid LEFT OUTER JOIN internal.circulationauditdate AS ca ON o.circulationauditdateid = ca.circulationauditdateid LEFT OUTER JOIN internal.circulationsource AS cs ON o.circulationsourceid = cs.circulationsourceid LEFT OUTER JOIN internal.websource AS ws ON o.websourceid = ws.websourceid LEFT OUTER JOIN internal.webauditdate AS wa ON o.webauditdateid = wa.webauditdateid LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid LEFT OUTER JOIN addresses AS a ON a.addressid = com.addressid WHERE s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND SELECTION(s.selected, %(selector)s)=true ORDER BY outletname </query></queries>'
WHERE reporttemplateid = 4;

UPDATE internal.reporttemplates SET
query_text = E'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Contact Name,Job Title,Contact Email,Contact Tel,Outlet Name,Outlet Profile,Readership,Publisher/Broadcaster,NRS,JICREG,Country"> SELECT JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname, e.job_title, get_override(ec_c.email, e_c.email, oc_oc.email, o_c.email),get_override(ec_c.tel, e_c.tel, oc_oc.tel, o_c.tel),JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN \'\' ELSE o.outletname END)as outletname, op.editorialprofile,op.readership, pub.publishername, op.nrsreadership, op.jicregreadership, country.countryname FROM userdata.searchsession as s JOIN outlets as o on o.outletid = s.outletid LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid LEFT OUTER JOIN contacts as c on e.contactid = c.contactid LEFT OUTER JOIN employeecustomers ec ON ec.employeeid = COALESCE(s.employeeid, oc.primaryemployeeid, o.primaryemployeeid) AND ec.customerid = s.customerid LEFT OUTER JOIN communications o_c ON o_c.communicationid = o.communicationid LEFT OUTER JOIN communications oc_oc ON oc_oc.communicationid = oc.communicationid LEFT OUTER JOIN communications e_c ON e_c.communicationid = e.communicationid LEFT OUTER JOIN communications ec_c ON ec.communicationid = ec_c.communicationid LEFT OUTER JOIN internal.countries AS country ON country.countryid = o.countryid LEFT OUTER JOIN outletprofile AS op ON o.outletid = op.outletid LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid WHERE s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND SELECTION(s.selected, %(selector)s)=true ORDER BY contactname </query></queries>'
WHERE reporttemplateid = 19;

UPDATE internal.reporttemplates SET
query_text = E'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Outlet Name,Contact Title,Contact First Name,Contact Surname,Contact Job Title,Contact Email,Contact Tel,Contact Twitter,Outlet Address,Outlet Email,Outlet Tel,Profile,Outlet web site,Outlet Media Channel,Outlet Frequency,Readership,Publisher/Broadcaster,NRS,JICREG,Circulation,Circulation date,Circulation source,Web browsers,Web source,Web date,Outlet Twitter,Outlet Country">SELECT JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN \'\' ELSE o.outletname END)as outletname, c.prefix, c.firstname, c.familyname, e.job_title, get_override(ec_c.email, e_c.email, oc_oc.email, o_c.email),get_override(ec_c.tel, e_c.tel, oc_oc.tel, o_c.tel),get_override(ec_c.twitter, e_c.twitter, oc_oc.twitter, o_c.twitter),get_override(JSON_ENCODE(addressfull(eca.address1,eca.address2,eca.county,eca.postcode,null,eca.townname)), JSON_ENCODE(addressfull(ea.address1,ea.address2,ea.county,ea.postcode,null,ea.townname)), JSON_ENCODE(addressfull(oca.address1,oca.address2,oca.county,oca.postcode,null,oca.townname)), JSON_ENCODE(addressfull(oa.address1,oa.address2,oa.county,oa.postcode,null,oa.townname))) as address,o_c.email, o_c.tel, op.editorialprofile,o.www, mediachannel.prmax_outlettypename, COALESCE(freq.frequencyname,\'\') AS frequencyname,op.readership, pub.publishername, op.nrsreadership, op.jicregreadership, CASE WHEN o.circulation = 0 THEN null ELSE o.circulation END as circulation, ca.circulationauditdatedescription, cs.circulationsourcedescription, o.webbrowsers, wa.webauditdatedescription, ws.websourcedescription,o_c.twitter, country.countryname FROM userdata.searchsession s JOIN outlets o ON o.outletid = s.outletid LEFT OUTER JOIN outletcustomers oc ON s.outletid = oc.outletid AND s.customerid = oc.customerid JOIN employees e ON COALESCE(s.employeeid, oc.primaryemployeeid, o.primaryemployeeid) = e.employeeid JOIN tg_user u ON s.userid = u.user_id LEFT OUTER JOIN contacts c ON e.contactid = c.contactid LEFT OUTER JOIN employeecustomers ec ON ec.employeeid = COALESCE(s.employeeid, oc.primaryemployeeid, o.primaryemployeeid) AND ec.customerid = s.customerid LEFT OUTER JOIN communications o_c ON o_c.communicationid = o.communicationid LEFT OUTER JOIN communications oc_oc ON oc_oc.communicationid = oc.communicationid LEFT OUTER JOIN communications e_c ON e_c.communicationid = e.communicationid LEFT OUTER JOIN communications ec_c ON ec.communicationid = ec_c.communicationid LEFT OUTER JOIN addresses oa ON oa.addressid = o_c.addressid LEFT OUTER JOIN addresses oca ON oca.addressid = oc_oc.addressid LEFT OUTER JOIN addresses ea ON ea.addressid = e_c.addressid LEFT OUTER JOIN addresses eca ON eca.addressid = ec_c.addressid LEFT OUTER JOIN internal.countries country ON country.countryid = o.countryid LEFT OUTER JOIN internal.frequencies as freq ON freq.frequencyid = o.frequencyid LEFT OUTER JOIN outletprofile as op ON op.outletid = o.outletid LEFT OUTER JOIN internal.circulationauditdate AS ca ON o.circulationauditdateid = ca.circulationauditdateid LEFT OUTER JOIN internal.circulationsource AS cs ON o.circulationsourceid = cs.circulationsourceid LEFT OUTER JOIN internal.websource AS ws ON o.websourceid = ws.websourceid LEFT OUTER JOIN internal.webauditdate AS wa ON o.webauditdateid = wa.webauditdateid LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid LEFT OUTER JOIN internal.prmax_outlettypes AS mediachannel ON mediachannel.prmax_outlettypeid = o.prmax_outlettypeid WHERE s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND SELECTION(s.selected, %(selector)s)=true ORDER BY outletname </query></queries>'
WHERE reporttemplateid = 14;

UPDATE internal.reporttemplates SET
query_text = E'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Outlet Name,Contact Name,Contact Job Title,Outlet Email,Outlet Tel,Profile,Readership,Publisher/Broadcaster,NRS,JICREG,Circulation,Circulation date,Circulation source,Web browsers,Web source,Web date,Country">SELECT JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN \'\' ELSE o.outletname END)as outletname, JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,\'\')) as contactname, e.job_title, get_override(oc_c.email,com.email) as email, get_override(oc_c.tel,com.tel) as tel, op.editorialprofile, op.readership, pub.publishername, op.nrsreadership, op.jicregreadership, CASE WHEN o.circulation = 0 THEN null ELSE o.circulation END as circulation, ca.circulationauditdatedescription, cs.circulationsourcedescription, o.webbrowsers, wa.webauditdatedescription, ws.websourcedescription,country.countryname FROM userdata.searchsession as s JOIN outlets as o on o.outletid = s.outletid LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid LEFT OUTER JOIN contacts as c on e.contactid = c.contactid LEFT OUTER JOIN communications AS com ON o.communicationid = com.communicationid LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid  LEFT OUTER JOIN internal.countries AS country ON country.countryid = o.countryid LEFT OUTER JOIN outletprofile AS op ON o.outletid = op.outletid LEFT OUTER JOIN internal.circulationauditdate AS ca ON o.circulationauditdateid = ca.circulationauditdateid LEFT OUTER JOIN internal.circulationsource AS cs ON o.circulationsourceid = cs.circulationsourceid LEFT OUTER JOIN internal.websource AS ws ON o.websourceid = ws.websourceid LEFT OUTER JOIN internal.webauditdate AS wa ON o.webauditdateid = wa.webauditdateid LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid WHERE s.userid = %(userid)s  and s.searchtypeid= %(searchtypeid)s  AND SELECTION(s.selected, %(selector)s)=true ORDER BY outletname </query></queries>'
WHERE reporttemplateid = 27;


UPDATE internal.reporttemplates SET
query_text = E'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Outlet Name,Profile,Readership,Publisher/Broadcaster,NRS,JICREG,Circulation,Circulation date,Circulation source,Web browsers,Web source,Web date,Country"> SELECT JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN \'\' ELSE o.outletname END)as outletname, op.editorialprofile, op.readership, pub.publishername, op.nrsreadership, op.jicregreadership, CASE WHEN o.circulation = 0 THEN null ELSE o.circulation END as circulation, ca.circulationauditdatedescription, cs.circulationsourcedescription, o.webbrowsers, wa.webauditdatedescription, ws.websourcedescription,country.countryname FROM userdata.searchsession as s JOIN outlets as o on o.outletid = s.outletid LEFT OUTER JOIN outletprofile AS op ON o.outletid = op.outletid LEFT OUTER JOIN internal.circulationauditdate AS ca ON o.circulationauditdateid = ca.circulationauditdateid LEFT OUTER JOIN internal.circulationsource AS cs ON o.circulationsourceid = cs.circulationsourceid LEFT OUTER JOIN internal.websource AS ws ON o.websourceid = ws.websourceid LEFT OUTER JOIN internal.webauditdate AS wa ON o.webauditdateid = wa.webauditdateid LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid LEFT OUTER JOIN internal.countries AS country ON country.countryid = o.countryid WHERE s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND SELECTION(s.selected, %(selector)s)=true ORDER BY outletname</query></queries>'
WHERE reporttemplateid = 11;


UPDATE internal.reporttemplates SET
query_text = E'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="outletname" header="Contact Name,Job Title,Contact Email,Contact Tel,Outlet Name,Country"> SELECT JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname, e.job_title, com.email, com.tel, JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN \'\' ELSE o.outletname END)as outletname, country.countryname FROM userdata.searchsession as s JOIN outlets as o on o.outletid = s.outletid LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid LEFT OUTER JOIN contacts as c on e.contactid = c.contactid LEFT OUTER JOIN internal.countries AS country ON country.countryid = o.countryid LEFT OUTER JOIN communications AS com on com.communicationid = o.communicationid WHERE s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND SELECTION(s.selected, %(selector)s)=true ORDER BY contactname </query></queries>'
WHERE reporttemplateid = 12;

INSERT INTO internal.clippingsource VALUES (7, 'Press Data');

CREATE TABLE internal.clippingorderstatus
(
  clippingorderstatusid integer NOT NULL,
  clippingorderstatusdescription character varying,
  CONSTRAINT clippingorderstatus_pkey PRIMARY KEY (clippingorderstatusid),
  CONSTRAINT clippingorderstatus_clippingorderstatusdescription_key UNIQUE (clippingorderstatusdescription)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.clippingorderstatus OWNER TO postgres;
GRANT ALL ON TABLE internal.clippingorderstatus TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.clippingorderstatus TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.clippingorderstatus TO prmaxcontrol;

INSERT INTO internal.clippingorderstatus VALUES (1, 'Active');
INSERT INTO internal.clippingorderstatus VALUES (2, 'Cancelled');

ALTER TABLE internal.clippingsorder ADD COLUMN clippingorderstatusid integer NOT NULL DEFAULT 1;
ALTER TABLE internal.clippingsorder ADD CONSTRAINT fk_clippingorderstatusid FOREIGN KEY (clippingorderstatusid) REFERENCES internal.clippingorderstatus (clippingorderstatusid)  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE research.datasourcetranslations ADD COLUMN ignore boolean NOT NULL DEFAULT false;
ALTER TABLE research.outlet_external_links ADD COLUMN ignore boolean NOT NULL DEFAULT false;

INSERT INTO internal.sourcetypes VALUES (11, 'South America');
INSERT INTO research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) VALUES (4, 'sr', 'prefix');
INSERT INTO research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) VALUES (4, 'sr.', 'prefix');
INSERT INTO research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) VALUES (4, 'sra', 'prefix');
INSERT INTO research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) VALUES (4, 'sra.', 'prefix');

ALTER TABLE internal.customersources ADD COLUMN communicationid integer;
ALTER TABLE internal.customersources ADD CONSTRAINT fk_customersourcescommunicationid FOREIGN KEY (communicationid) REFERENCES communications (communicationid)  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE internal.customersources ADD COLUMN contactname character varying;
ALTER TABLE internal.customersources ADD COLUMN name character varying;

INSERT INTO internal.reportsource VALUES (13, 'Partners Customers');
INSERT INTO internal.reportsource VALUES (14, 'Partners Statement');

INSERT INTO internal.reporttemplates VALUES (28, -1, 'Listing Partner Customers', '<queries><query type="CUSTOM"></query></queries>', '',  13, 'PartnersListCustomersReport');
INSERT INTO internal.reporttemplates VALUES (29, -1, 'Partners Statement', '<queries><query type="CUSTOM"></query></queries>', '',  14, 'PartnersStatementReport');

CREATE TABLE internal.tasktypestatus
(
  tasktypestatusid integer NOT NULL,
  tasktypestatusdescription character varying NOT NULL,
  CONSTRAINT pk_tasktypestatus PRIMARY KEY (tasktypestatusid),
  CONSTRAINT un_tasktypestatus UNIQUE (tasktypestatusdescription)
)
WITH (OIDS=FALSE);

ALTER TABLE internal.tasktypestatus OWNER TO postgres;
GRANT ALL ON TABLE internal.tasktypestatus TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.tasktypestatus TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.tasktypestatus TO prmaxcontrol;

INSERT INTO internal.tasktypestatus VALUES (1, 'Active');
INSERT INTO internal.tasktypestatus VALUES (2, 'Deleted');

ALTER TABLE internal.tasktypes ADD COLUMN tasktypestatusid integer NOT NULL DEFAULT 1;
ALTER TABLE internal.tasktypes ADD CONSTRAINT fk_tasktypestatusid FOREIGN KEY (tasktypestatus) REFERENCES internal.tasktypestatus (tasktypestatusid)  ON UPDATE NO ACTION ON DELETE SET NULL;

UPDATE internal.tasktypes SET tasktypestatusid = 1;