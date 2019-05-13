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