

-- reset index's for clipping speed up delete ?
ALTER TABLE userdata.clippings DROP CONSTRAINT clippings_listmemberid_fkey;
ALTER TABLE userdata.clippings DROP CONSTRAINT clippings_outletid_fkey1;
ALTER TABLE clippingstore DROP CONSTRAINT clippingstore_outletid_fkey;



ALTER TABLE userdata.clippings ADD CONSTRAINT fk_listmembers FOREIGN KEY (listmemberid) REFERENCES userdata.listmembers (listmemberid)
   ON UPDATE NO ACTION ON DELETE SET NULL;
CREATE INDEX fki_listmembers ON userdata.clippings(listmemberid);

ALTER TABLE userdata.clippings ADD CONSTRAINT fk_cl_outletid FOREIGN KEY (outletid) REFERENCES outlets (outletid)
   ON UPDATE NO ACTION ON DELETE SET NULL;
CREATE INDEX fki_cl_outletid ON userdata.clippings(outletid);

ALTER TABLE clippingstore ADD CONSTRAINT fk_cs_outletid FOREIGN KEY (outletid) REFERENCES outlets (outletid)
   ON UPDATE NO ACTION ON DELETE SET NULL;
CREATE INDEX fki_cs_outletid ON clippingstore(outletid);


INSERT INTO internal.reporttemplates VALUES (32, -1, 'Statistics Report', '<queries><query type="CUSTOM"></query></queries>', '', 9, 'StatisticsReport');
