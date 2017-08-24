ALTER TABLE userdata.clippings DROP CONSTRAINT clippings_outletid_fkey;
ALTER TABLE userdata.clippings ADD CONSTRAINT clippings_outletid_fkey1 FOREIGN KEY (outletid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE SET NULL;

update outlets set prmax_outlettypeid = 13 WHERE prmax_outlettypeid = 68;
update outlets set prmax_outlettypeid = 15 WHERE prmax_outlettypeid = 67;
DELETE FROM internal.prmax_outlettypes WHERE prmax_outlettypeid IN (67,68);

insert into internal.reporttemplates values
(30, -1, 'Distribution Check List2',
'<queries><query type="SQL" format="list" dictname="results" defaultsortorder="sort_outletname" header="Outlet Name,Contact Name,Tel,Email,Status"> SELECT outletname, contactname, tel, emailaddress, distributionstatusdescription FROM distributed_view as dv WHERE dv.listid = %(listid)s ORDER BY sortname</query></queries>',
'', 8, 'DistributionReport');

insert into internal.reporttemplates values
(31, -1, 'Activity Report',
'<queries><query type="CUSTOM"></query></queries>',
'', 9, 'ActivityReport');

ALTER TABLE seoreleases.seocache
ADD COLUMN layout integer NOT NULL default 0;

ALTER TABLE seoreleases.seocache DROP CONSTRAINT pk_cache;
ALTER TABLE seoreleases.seocache ADD CONSTRAINT pk_cache PRIMARY KEY (seoreleaseid, layout);
UPDATE seoreleases.seocache SET layout = 0;

ALTER TABLE userdata.emailtemplates ADD COLUMN sendpriority integer NOT NULL DEFAULT 0;

insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'sr.', 'prefix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'sr', 'prefix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'sra.', 'prefix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'sra', 'prefix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'm.', 'prefix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'm', 'prefix');

insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'jr.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'jr', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'dr.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'dr', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'pe.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'pe', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'dep.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'dep', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'pr.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'pr', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'dra.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'dra', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'padre.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'padre', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'pastor.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'pastor', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'd.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'd', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'prof.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'prof', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'fr.', 'suffix');
insert into research.datasourcetranslations (sourcetypeid, sourcetext, fieldname) values (4, 'fr', 'suffix');


ALTER TABLE internal.customers ADD COLUMN extended_security boolean NOT NULL DEFAULT false;
UPDATE internal.customers SET extended_security = false;

ALTER TABLE tg_user ADD COLUMN invalid_login_tries integer NOT NULL DEFAULT 0;
UPDATE tg_user SET invalid_login_tries = 0;

ALTER TABLE tg_user ADD COLUMN force_change_pssw boolean NOT NULL DEFAULT false;
UPDATE tg_user SET force_change_pssw = false;

ALTER TABLE tg_user ADD COLUMN last_change_pssw timestamp without time zone;

ALTER TABLE internal.customers ADD COLUMN valid_ips character varying;


ALTER TABLE seoreleases.seorelease ALTER twitter TYPE character varying;
ALTER TABLE seoreleases.seorelease ALTER facebook TYPE character varying;


ALTER TABLE internal.customers ADD COLUMN required_client boolean NOT NULL DEFAULT false;
UPDATE internal.customers SET required_client = false;

ALTER TABLE internal.hostspf ADD COLUMN privatekey character varying;
ALTER TABLE internal.hostspf ADD COLUMN selector character varying;

ALTER TABLE internal.seocategories ADD COLUMN seocategorydescription_welsh character varying;

UPDATE internal.seocategories SET seocategorydescription_welsh = 'Celf ac Adloniant' where seocategoryid = 1;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Moduron, Llongau a Hedfan' where seocategoryid = 2;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Busnes a Chyllid' where seocategoryid = 3;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Elusennau' where seocategoryid = 4;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Plant, Pobl Ifanc a Bywyd Teulu' where seocategoryid = 5;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Adeiladu' where seocategoryid = 6;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Crefftau a Hobïau' where seocategoryid = 7;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Ynni' where seocategoryid = 8;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Yr Amgylchedd ac Anifeiliaid' where seocategoryid = 9;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Ffermio, Pysgota a Choedwigaeth' where seocategoryid = 10;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Ffasiwn a Harddwch' where seocategoryid = 11;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Bwyd, Diod a Lletygarwch' where seocategoryid = 12;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Llywodraeth, Amddiffyn a’r Gyfraith' where seocategoryid = 13;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Y Cartref a’r Ardd' where seocategoryid = 14;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Y Diwydiant Cynhyrchu' where seocategoryid = 15;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Y Cyfryngau a Marchnata' where seocategoryid = 16;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'O ddiddordeb i ddynion' where seocategoryid = 17;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Mân-werthu a Chyfanwerthu' where seocategoryid = 18;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Gwyddoniaeth a Meddyginiaeth' where seocategoryid = 19;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Chwaraeon, Iechyd a Ffitrwydd' where seocategoryid = 20;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Technoleg' where seocategoryid = 21;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Masnach, Trafnidiaeth a’r Gadwyn Gyflenwi' where seocategoryid = 22;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Teithio a Thwristiaeth' where seocategoryid = 23;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'O ddiddordeb i fenywod' where seocategoryid = 24;
UPDATE internal.seocategories SET seocategorydescription_welsh = 'Gwaith ac Addysg' where seocategoryid = 25;

ALTER TABLE internal.seocategories ALTER COLUMN seocategorydescription_welsh SET NOT NULL;

UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about you as a freelancer in the PRmax’s database and amend or add to it as required.</p>
<p>The deadline for this update is %(deadline)s. You will receive two more reminders as the deadline approaches.</p>
<p>Please click on the link below. It will take you to an update screen to review and amend the information in the database. Your freelance record in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 7;

UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p> This is your opportunity to review all the information we hold about you as a freelancer in the PRmax’s database and amend or add to it as required.</p>
<p>The deadline for this update is %(deadline)s. You will receive one more reminder as the deadline approaches.</p>
<p> Please click on the link below. It will take you to an update screen to review and amend the information in the database. Your freelance record in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 8;
UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p> This is your opportunity to review all the information we hold about you as a freelancer in the PRmax’s database and amend or add to it as required.</p>
<p>The deadline for this update is %(deadline)s.</p>
<p> Please click on the link below. It will take you to an update screen to review and amend the information in the database. Your freelance record in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 9;
UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about your editorial desk and amend or add to it as necessary.</p>
<p>The deadline for this update is %(deadline)s. You will receive two more reminders as the deadline approaches.</p>
<p>Please click on the link below. It will take you to an update wizard to review and amend the information in the database. Your desk’s listing in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 10;
UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about your editorial desk and amend or add to it as necessary.</p>
<p>The deadline for this update is %(deadline)s. You will receive one more reminder as the deadline approaches.</p>
<p>Please click on the link below. It will take you to an update wizard to review and amend the information in the database. Your desk’s listing in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 11;
UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about your editorial desk and amend or add to it as necessary.</p>
<p>The deadline for this update is %(deadline)s.</p>
<p>Please click on the link below. It will take you to an update wizard to review and amend the information in the database. Your desk’s listing in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 12;
UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about your media outlet and amend or add to it as necessary.</p>
<p>The deadline for this update is %(deadline)s. You will receive two more reminders as the deadline approaches.</p>
<p>Please click on the link below. It will take you to an update wizard to review and amend the information in the database. Your outlet’s listing in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 1;
UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about your media outlet and amend or add to it as necessary.</p>
<p>The deadline for this update is %(deadline)s. You will receive one more reminder as the deadline approaches.</p>
<p>Please click on the link below. It will take you to an update wizard to review and amend the information in the database. Your outlet’s listing in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 2;
UPDATE research.questionnairetext set email_body_text = '<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about your media outlet and amend or add to it as necessary.</p>
<p>The deadline for this update is %(deadline)s.</p>
<p>Please click on the link below. It will take you to an update wizard to review and amend the information in the database. Your outlet’s listing in the database is completely free of charge.</p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
<p>%(researcher)s</p>'
where questionnairetextid = 3;


CREATE TABLE userdata.clippingselection
(
  userid integer NOT NULL,
  clippingid integer NOT NULL,
  CONSTRAINT pk_clippingselection PRIMARY KEY (userid,clippingid),
  CONSTRAINT fk_clippingid FOREIGN KEY (clippingid)
      REFERENCES userdata.clippings (clippingid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_userid FOREIGN KEY (userid)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE userdata.clippingselection OWNER TO postgres;
GRANT ALL ON TABLE userdata.clippingselection TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.clippingselection TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.clippingselection TO prmaxcontrol;

CREATE TABLE internal.servertypes
(
  servertypeid integer NOT NULL,
  servertypename character varying NOT NULL,
  CONSTRAINT pk_servertype PRIMARY KEY (servertypeid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.servertypes OWNER TO postgres;
GRANT ALL ON TABLE internal.servertypes TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.servertypes TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.servertypes TO prmaxcontrol;

INSERT INTO internal.servertypes VALUES (2, 'gmail');
INSERT INTO internal.servertypes VALUES (3, 'yahoo');
INSERT INTO internal.servertypes VALUES (4, 'hotmail');
INSERT INTO internal.servertypes VALUES (5, '1to1');

CREATE TABLE public.customeremailserver
(
  customeremailserverid serial NOT NULL,
  fromemailaddress character varying NOT NULL,
  customerid integer NOT NULL,
  servertypeid integer NOT NULL,
  username character varying NOT NULL,
  password character varying NOT NULL,
  CONSTRAINT pk_customeremailserver PRIMARY KEY (customeremailserverid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_servertypeid FOREIGN KEY (servertypeid)
      REFERENCES internal.servertypes (servertypeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT un_customeremailserver UNIQUE (fromemailaddress, customerid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.customeremailserver OWNER TO postgres;
GRANT ALL ON TABLE public.customeremailserver TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE public.customeremailserver TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE public.customeremailserver TO prmaxcontrol;
GRANT ALL ON TABLE customeremailserver_customeremailserverid_seq TO postgres;
GRANT UPDATE ON TABLE customeremailserver_customeremailserverid_seq TO prmax;
GRANT UPDATE ON TABLE customeremailserver_customeremailserverid_seq TO prmaxcontrol;


ALTER TABLE communications ADD COLUMN instagram character varying;
INSERT INTO research.fields VALUES (72, 'Instagram');


CREATE TABLE internal.emaillayout
(
  emaillayoutid integer NOT NULL,
  customerid integer,
  emaillayoutdescription character varying NOT NULL,
  CONSTRAINT pk_customer_emaillayoutid PRIMARY KEY (emaillayoutid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT un_customer_emaillayoutdescription UNIQUE (customerid, emaillayoutdescription)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.emaillayout OWNER TO postgres;
GRANT ALL ON TABLE internal.emaillayout TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emaillayout TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emaillayout TO prmaxcontrol;

INSERT INTO internal.emaillayout VALUES (1, null, 'Standard');

CREATE TABLE internal.emailheader
(
  emailheaderid serial NOT NULL,
  customerid integer,
  emailheaderdescription character varying NOT NULL,
  htmltext character varying,
  CONSTRAINT pk_customer_emailheaderid PRIMARY KEY (emailheaderid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT un_customer_emailheaderdescription UNIQUE (customerid, emailheaderdescription)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.emailheader OWNER TO postgres;
GRANT ALL ON TABLE internal.emailheader TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emailheader TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emailheader TO prmaxcontrol;
ALTER TABLE internal.emailheader_emailheaderid_seq OWNER TO postgres;
GRANT ALL ON TABLE internal.emailheader_emailheaderid_seq TO postgres;
GRANT UPDATE ON TABLE internal.emailheader_emailheaderid_seq TO prmax;

CREATE TABLE internal.emailfooter
(
  emailfooterid serial NOT NULL,
  customerid integer,
  emailfooterdescription character varying NOT NULL,
  htmltext character varying,
  CONSTRAINT pk_customer_emailfooterid PRIMARY KEY (emailfooterid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE RESTRICT,
  CONSTRAINT un_customer_emailfooterdescription UNIQUE (customerid, emailfooterdescription)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE internal.emailfooter OWNER TO postgres;
GRANT ALL ON TABLE internal.emailfooter TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emailfooter TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE internal.emailfooter TO prmaxcontrol;
ALTER TABLE internal.emailfooter_emailfooterid_seq OWNER TO postgres;
GRANT ALL ON TABLE internal.emailfooter_emailfooterid_seq TO postgres;
GRANT UPDATE ON TABLE internal.emailfooter_emailfooterid_seq TO prmax;

INSERT INTO internal.emailheader (emailheaderdescription) VALUES ('No Header');
INSERT INTO internal.emailfooter (emailfooterdescription) VALUES ('No Footer');

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
com.facebook,
com.instagram

FROM tg_user AS u
JOIN internal.researchexternalcontacts AS rxt ON rxt.researchexternalcontactid = u.researchexternalcontactid
JOIN outlets AS o ON o.outletid = rxt.outletid
JOIN communications AS com ON com.communicationid = o.communicationid
JOIN addresses AS a ON a.addressid = com.addressid
JOIN employees AS e on o.primaryemployeeid = e.employeeid
JOIN contacts AS con ON con.contactid = e.contactid;

GRANT SELECT ON research_external_data TO prcontact;


DROP VIEW ListMember_Ai_View;

CREATE VIEW ListMember_Ai_View AS SELECT
	lm.listid,
	lm.outletid,
	CASE WHEN lm.employeeid IS NULL THEN o.primaryemployeeid ELSE lm.employeeid END as employeeid,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	COALESCE(o.circulation,0) AS circulation,
	o.frequencyid,
	a.address1,
	a.address2,
	a.townname,
	a.county,
	a.postcode,
	comm.email AS outlet_email,
	comm.tel AS outlet_tel,
	comm.fax,
	o.prmax_outlettypeid AS outlettypeid,
	e.job_title,
	JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	get_override(ecomm.email,comm.email,'','') AS contact_email,
	ecomm.tel AS contact_tel,
	o.www,
	get_override(ecomm.twitter,comm.twitter,'','') AS contact_twitter,
	get_override(ecomm.facebook,comm.facebook,'','') AS contact_facebook,
	get_override(ecomm.linkedin,comm.linkedin,'','') AS contact_linkedin,
	get_override(ecomm.instagram,comm.instagram,'','') AS contact_instagram,
	o.profile

FROM userdata.listmembers AS lm
JOIN userdata.list AS l ON lm.listid = l.listid
JOIN outlets as o ON o.outletid = lm.outletid
JOIN communications AS comm ON comm.communicationid = o.communicationid
JOIN addresses AS a ON a.addressid = comm.addressid
JOIN employees AS e ON COALESCE(lm.employeeid,o.primaryemployeeid)= e.employeeid
LEFT OUTER JOIN communications AS ecomm ON ecomm.communicationid = e.communicationid
LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
ORDER BY o.outletname;

GRANT SELECT ON ListMember_Ai_View TO prapi;


DROP VIEW Search_Results_View_Report;

CREATE VIEW Search_Results_View_Report  AS SELECT
	s.selected as selected,
	CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END as outletname,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
	CASE WHEN s.employeeid IS NULL THEN o.primaryemployeeid ELSE s.employeeid END as employeeid,
	s.outletid,
	o.customerid,
	s.appended,
	s.userid,
	s.searchtypeid,
	c.familyname,
	c.firstname,
	c.prefix,
	c.suffix,
	-- for addresses
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.address1 ELSE oca.address1 END
	     ELSE ea.address1 END
	ELSE eca.address1 END,'') as address1,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.address2 ELSE oca.address2 END
	     ELSE ea.address2 END
	ELSE eca.address2 END,'') as address2,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.townname ELSE oca.townname END
	     ELSE ea.townname END
	ELSE eca.townname END,'') as townname,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.county ELSE oca.county END
	     ELSE ea.county END
	ELSE eca.county END,'') as county,
	coalesce(CASE WHEN eca.address1 IS NULL THEN
	     CASE WHEN ea.address1 IS NULL THEN
		CASE WHEN oca.address1 IS NULL THEN oa.postcode ELSE oca.postcode END
	     ELSE ea.postcode END
	ELSE eca.postcode END,'') as postcode,
	get_override(ec_c.tel,e_c.tel,oc_oc.tel,o_c.tel) as tel,
	get_override(ec_c.email,e_c.email,oc_oc.email,o_c.email) as email,
	e.job_title,
	pr.sortorder,
	coalesce(e.prmaxstatusid,1) AS prmaxstatusid,
	UPPER(o.outletname) as sortname,
	pr.prmax_outlettypename,
	o.circulation,
	get_override(ec_c.twitter,e_c.twitter,oc_oc.twitter,o_c.twitter) AS twitter,
	get_override(ec_c.facebook,e_c.facebook,oc_oc.facebook,o_c.facebook) AS facebook,
	get_override(ec_c.linkedin,e_c.linkedin,oc_oc.linkedin,o_c.linkedin) AS linkedin,
	get_override(ec_c.instagram,e_c.instagram,oc_oc.instagram,o_c.instagram) AS instagram,
	country.countryname,
	o.profile_link_field as displaylink
	FROM userdata.searchsession as s
		JOIN outlets as o on o.outletid = s.outletid
		LEFT OUTER JOIN outletcustomers as oc ON s.outletid = oc.outletid AND s.customerid = oc.customerid
		JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
		JOIN tg_user as u on s.userid = u.user_id
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid) AND ec.customerid = s.customerid

		-- outlet communications
		LEFT OUTER JOIN communications as o_c ON o_c.communicationid = o.communicationid
		-- outlet override
		LEFT OUTER JOIN communications as oc_oc ON oc_oc.communicationid = oc.communicationid
		-- employee communications
		LEFT OUTER JOIN communications as e_c ON e_c.communicationid = e.communicationid
		-- employee override
		LEFT OUTER JOIN communications as ec_c ON ec.communicationid = ec_c.communicationid

		LEFT OUTER JOIN addresses as oa ON oa.addressid = o_c.addressid
		LEFT OUTER JOIN addresses as oca ON oca.addressid = oc_oc.addressid
		LEFT OUTER JOIN addresses as ea ON ea.addressid = e_c.addressid
		LEFT OUTER JOIN addresses as eca ON eca.addressid = ec_c.addressid
		LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
		LEFT OUTER JOIN internal.countries as country ON country.countryid = o.countryid

ORDER BY o.outletname;

GRANT SELECT ON Search_Results_View_Report TO prmax;


DROP VIEW ListMember_Ai_View;

CREATE VIEW ListMember_Ai_View AS SELECT
	lm.listid,
	lm.outletid,
	CASE WHEN lm.employeeid IS NULL THEN o.primaryemployeeid ELSE lm.employeeid END as employeeid,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	COALESCE(o.circulation,0) AS circulation,
	o.frequencyid,
	a.address1,
	a.address2,
	a.townname,
	a.county,
	a.postcode,
	comm.email AS outlet_email,
	comm.tel AS outlet_tel,
	comm.fax,
	o.prmax_outlettypeid AS outlettypeid,
	e.job_title,
	JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	get_override(ecomm.email,comm.email,'','') AS contact_email,
	ecomm.tel AS contact_tel,
	o.www,
	get_override(ecomm.twitter,comm.twitter,'','') AS contact_twitter,
	get_override(ecomm.facebook,comm.facebook,'','') AS contact_facebook,
	get_override(ecomm.linkedin,comm.linkedin,'','') AS contact_linkedin,
	get_override(ecomm.instagram,comm.instagram,'','') AS contact_instagram,
	o.profile

FROM userdata.listmembers AS lm
JOIN userdata.list AS l ON lm.listid = l.listid
JOIN outlets as o ON o.outletid = lm.outletid
JOIN communications AS comm ON comm.communicationid = o.communicationid
JOIN addresses AS a ON a.addressid = comm.addressid
JOIN employees AS e ON COALESCE(lm.employeeid,o.primaryemployeeid)= e.employeeid
LEFT OUTER JOIN communications AS ecomm ON ecomm.communicationid = e.communicationid
LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
ORDER BY o.outletname;

GRANT SELECT ON ListMember_Ai_View TO prapi;

DROP VIEW ListMember_Ai_View;
CREATE VIEW ListMember_Ai_View AS SELECT
	lm.listid,
	lm.outletid,
	CASE WHEN lm.employeeid IS NULL THEN o.primaryemployeeid ELSE lm.employeeid END as employeeid,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	o.circulation,
	o.frequencyid,
	a.address1,
	a.address2,
	a.townname,
	a.county,
	a.postcode,
	comm.email AS outlet_email,
	comm.tel AS outlet_tel,
	comm.fax,
	o.prmax_outlettypeid AS outlettypeid,
	e.job_title,
	JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	get_override(ecomm.email,comm.email,'','') AS contact_email,
	ecomm.tel AS contact_tel,
	o.www,
	get_override(ecomm.twitter,comm.twitter,'','') AS contact_twitter,
	get_override(ecomm.facebook,comm.facebook,'','') AS contact_facebook,
	get_override(ecomm.linkedin,comm.linkedin,'','') AS contact_linkedin,
	get_override(ecomm.instagram,comm.instagram,'','') AS contact_instagram,
	o.profile

FROM userdata.listmembers AS lm
JOIN userdata.list AS l ON lm.listid = l.listid
JOIN outlets as o ON o.outletid = lm.outletid
JOIN communications AS comm ON comm.communicationid = o.communicationid
JOIN addresses AS a ON a.addressid = comm.addressid
JOIN employees AS e ON COALESCE(lm.employeeid,o.primaryemployeeid)= e.employeeid
JOIN communications AS ecomm ON ecomm.communicationid = e.communicationid
LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
ORDER BY o.outletname;

GRANT SELECT ON ListMember_Ai_View TO prapi;

INSERT INTO internal.customertypes(customertypeid, customertypename) VALUES (23,'PressData');

ALTER TABLE internal.customers ADD COLUMN crm_outcome character varying(45) NOT NULL DEFAULT 'Outcome';
ALTER TABLE internal.customers ADD COLUMN crm_subject character varying(45) NOT NULL DEFAULT 'Subject';

ALTER TABLE userdata.contacthistory ADD COLUMN crm_response text;
ALTER TABLE userdata.contacthistory ADD COLUMN crm_subject character varying(255);

ALTER TABLE tg_user ADD COLUMN external_key character varying(20);
ALTER TABLE tg_user ADD UNIQUE (customerid, external_key);

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
 u.external_key
   FROM tg_user u;

ALTER TABLE user_external_view OWNER TO postgres;
GRANT ALL ON TABLE user_external_view TO postgres;
GRANT SELECT ON TABLE user_external_view TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE user_external_view TO prmaxcontrol;


CREATE TABLE userdata.contacthistoryresponses
(
   contacthistoryresponseid serial NOT NULL,
   taken_by integer NOT NULL,
   contacthistorystatusid integer NOT NULL,
   response text,
   taken timestamp without time zone,
   contacthistoryid integer NOT NULL,
   contacthistorytypeid integer NOT NULL,
	PRIMARY KEY (contacthistoryresponseid),
	FOREIGN KEY (taken_by) REFERENCES tg_user (user_id) ON UPDATE NO ACTION ON DELETE SET NULL,
	FOREIGN KEY (contacthistorystatusid) REFERENCES internal.contacthistorystatus (contacthistorystatusid) ON UPDATE NO ACTION ON DELETE RESTRICT,
	FOREIGN KEY (contacthistoryid) REFERENCES userdata.contacthistory (contacthistoryid) ON UPDATE NO ACTION ON DELETE CASCADE,
	FOREIGN KEY (contacthistorytypeid) REFERENCES internal.contacthistorytypes (contacthistorytypeid) ON UPDATE NO ACTION ON DELETE RESTRICT
) WITH (  OIDS = FALSE);


ALTER TABLE userdata.contacthistoryresponses ALTER COLUMN taken_by DROP NOT NULL;
ALTER TABLE userdata.contacthistoryresponses ALTER COLUMN contacthistorytypeid DROP NOT NULL;

ALTER TABLE userdata.contacthistoryresponses OWNER TO postgres;
GRANT ALL ON TABLE userdata.contacthistoryresponses TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.contacthistoryresponses TO prmax;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE userdata.contacthistoryresponses TO prmaxcontrol;
ALTER TABLE userdata.contacthistoryresponses_contacthistoryresponseid_seq OWNER TO postgres;
GRANT ALL ON TABLE userdata.contacthistoryresponses_contacthistoryresponseid_seq TO postgres;
GRANT UPDATE ON TABLE userdata.contacthistoryresponses_contacthistoryresponseid_seq TO prmax;

INSERT INTO internal.contacthistorytypes VALUES (7, 'Phone and email','t', null);

create function to_month(integer) returns varchar as
$$
	select to_char(to_timestamp(to_char($1, '999'), 'MM'), 'Mon');
$$ language sql;

ALTER TABLE userdata.clippingsanalysistemplate ADD COLUMN customerid integer;
ALTER TABLE userdata.clippingsanalysistemplate ADD FOREIGN KEY (customerid) REFERENCES internal.customers (customerid) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE userdata.clippingsanalysis ADD COLUMN customerid integer;
ALTER TABLE userdata.clippingsanalysis ADD FOREIGN KEY (customerid) REFERENCES internal.customers (customerid) ON UPDATE NO ACTION ON DELETE CASCADE;


ALTER TABLE userdata.client ADD COLUMN instagram character varying;
ALTER TABLE seoreleases.seorelease ADD COLUMN instagram character varying;

ALTER TABLE userdata.contacthistoryuserdefine ALTER COLUMN description TYPE varchar(90);