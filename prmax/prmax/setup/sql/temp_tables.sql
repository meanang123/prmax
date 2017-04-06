ALTER TABLE userdata.clippings
	DROP CONSTRAINT clippings_outletid_fkey;
ALTER TABLE userdata.clippings
	ADD CONSTRAINT clippings_outletid_fkey1 FOREIGN KEY (outletid) REFERENCES outlets (outletid) ON UPDATE NO ACTION ON DELETE SET NULL;
