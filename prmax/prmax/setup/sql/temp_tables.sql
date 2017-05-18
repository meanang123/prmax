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


ALTER TABLE userdata.emailtemplates ADD COLUMN sendpriority integer NOT NULL DEFAULT 0;
