ALTER TABLE userdata.clippings DROP CONSTRAINT clippings_outletid_fkey;
ALTER TABLE userdata.clippings ADD CONSTRAINT clippings_outletid_fkey1 FOREIGN KEY (outletid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE SET NULL;

update outlets set prmax_outlettypeid = 13 WHERE prmax_outlettypeid = 68;
update outlets set prmax_outlettypeid = 15 WHERE prmax_outlettypeid = 67;
DELETE FROM internal.prmax_outlettypes WHERE prmax_outlettypeid IN (67,68);

