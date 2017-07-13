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
