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

