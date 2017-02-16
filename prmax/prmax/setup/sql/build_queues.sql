CREATE SCHEMA queues
  AUTHORIZATION postgres;

GRANT ALL ON SCHEMA queues TO postgres;
GRANT USAGE ON SCHEMA queues TO prmax;
GRANT USAGE ON SCHEMA queues TO prmaxmsword;


-- Table: queues.cachequeue

CREATE TABLE queues.cachequeue
(
  customerid integer NOT NULL,
  objectid integer NOT NULL,
  objecttypeid integer,
  params bytea,
  cachequeueid serial NOT NULL,
  CONSTRAINT pk_cachequeue PRIMARY KEY (cachequeueid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE queues.cachequeue OWNER TO postgres;
GRANT ALL ON TABLE queues.cachequeue TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE queues.cachequeue TO prmax;
COMMENT ON TABLE queues.cachequeue IS 'items that can pre pre-run';

-- Table: queues.emailqueue

CREATE TABLE queues.emailqueue
(
  emailqueueid serial NOT NULL,
  emailaddress character varying NOT NULL,
  subject character varying NOT NULL,
  statusid integer NOT NULL DEFAULT 1,
  error character varying,
  message bytea,
  emailqueuetypeid integer DEFAULT 1,
  customerid integer,
  outletid integer,
  employeeid integer,
  sent timestamp with time zone DEFAULT now(),
  embargo timestamp with time zone,
  CONSTRAINT pk_email_queue PRIMARY KEY (emailqueueid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE queues.emailqueue OWNER TO postgres;
GRANT ALL ON TABLE queues.emailqueue TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE queues.emailqueue TO prmax;

-- Table: queues.indexerqueue

CREATE TABLE queues.indexerqueue
(
  indexerqueueid serial NOT NULL,
  objecttype integer NOT NULL,
  objectid integer,
  data bytea,
  "action" smallint NOT NULL DEFAULT 1,
  customerid integer,
  CONSTRAINT pk_object PRIMARY KEY (indexerqueueid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE queues.indexerqueue OWNER TO postgres;
GRANT ALL ON TABLE queues.indexerqueue TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE queues.indexerqueue TO prmax;

ALTER TABLE queues.indexerqueue ADD COLUMN data_string character varying;

-- Table: queues.mswordqueue

CREATE TABLE queues.mswordqueue
(
  mswordqueueid bigserial NOT NULL,
  statusid integer DEFAULT 1,
  indata bytea, -- Data submitted by customer
  outdata bytea, -- result of conversion
  orgfilename character varying, -- original file name
  "template" character varying(45) DEFAULT 'cgh'::character varying,
  userid integer,
  customerid integer,
  emailtemplateid integer,
  uploadeddate time without time zone DEFAULT now(),
  cleanuphtmltypeid integer NOT NULL DEFAULT 0,
  CONSTRAINT pk_msword PRIMARY KEY (mswordqueueid),
  CONSTRAINT fk_customerid FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_emailtemplateid FOREIGN KEY (emailtemplateid)
      REFERENCES userdata.emailtemplates (emailtemplateid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_userid FOREIGN KEY (userid)
      REFERENCES tg_user (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE SET NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE queues.mswordqueue OWNER TO postgres;
GRANT ALL ON TABLE queues.mswordqueue TO postgres;
GRANT SELECT, INSERT ON TABLE queues.mswordqueue TO prmax;
GRANT SELECT, UPDATE, INSERT ON TABLE queues.mswordqueue TO prmaxmsword;
COMMENT ON TABLE queues.mswordqueue IS 'queue for processing word document''s to html';
COMMENT ON COLUMN queues.mswordqueue.indata IS 'Data submitted by customer';
COMMENT ON COLUMN queues.mswordqueue.outdata IS 'result of conversion ';
COMMENT ON COLUMN queues.mswordqueue.orgfilename IS 'original file name';

-- Table: queues.reports

CREATE TABLE queues.reports
(
  reportid serial NOT NULL,
  customerid integer,
  reporttypeid integer,
  reportdatainfo bytea,
  reportoptions bytea, -- dictionary of options needed to build report would eb selected by the user
  reportoutputtypeid integer, -- what the format of the output pdf/html/csv/word etc
  created timestamp without time zone NOT NULL DEFAULT ('now'::text)::timestamp without time zone,
  reportstatusid integer NOT NULL DEFAULT 0, -- current status of the report is it build or not etc
  reporttemplateid integer NOT NULL,
  reportoutput bytea,
  CONSTRAINT pk_reportid PRIMARY KEY (reportid),
  CONSTRAINT fk_reporttemplateid FOREIGN KEY (reporttemplateid)
      REFERENCES internal.reporttemplates (reporttemplateid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT pk_customer FOREIGN KEY (customerid)
      REFERENCES internal.customers (customerid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE queues.reports OWNER TO postgres;
GRANT ALL ON TABLE queues.reports TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE queues.reports TO prmax;
COMMENT ON TABLE queues.reports IS 'stores the user report
user request a report is added to here
processed by the reportbuiolder service
front end checked for chnage of sttaus
removed after a day';
COMMENT ON COLUMN queues.reports.reportoptions IS 'dictionary of options needed to build report would eb selected by the user';
COMMENT ON COLUMN queues.reports.reportoutputtypeid IS 'what the format of the output pdf/html/csv/word etc';
COMMENT ON COLUMN queues.reports.reportstatusid IS 'current status of the report is it build or not etc';


-- Index: queues.fki_reporttemplateid

CREATE INDEX fki_reporttemplateid
  ON queues.reports
  USING btree
  (reporttemplateid);


GRANT UPDATE ON SEQUENCE queues.cachequeue_cachequeueid_seq TO PRMAX;
GRANT UPDATE ON SEQUENCE queues.emailqueue_emailqueueid_seq TO PRMAX;
GRANT UPDATE ON SEQUENCE queues.indexerqueue_indexerqueueid_seq TO PRMAX;
GRANT UPDATE ON SEQUENCE queues.reports_reportid_seq TO PRMAX;
GRANT UPDATE ON SEQUENCE queues.mswordqueue_mswordqueueid_seq TO PRMAX;


CREATE TABLE research.bounceddistribution
(
  bounceddistributionid serial NOT NULL,
  listmemberdistributionid integer,
  emailmessage text,
  outletid integer,
  employeeid integer,
  created timestamp without time zone DEFAULT now(),
  completed boolean NOT NULL DEFAULT false,
  completed_date timestamp without time zone,
  completed_userid integer,
  subject character varying,
  reasoncodeid integer,
  reason character varying,
  isautomated boolean DEFAULT false,
  CONSTRAINT pk_bounceddistribution PRIMARY KEY (bounceddistributionid),
  CONSTRAINT fk_employees FOREIGN KEY (employeeid)
      REFERENCES employees (employeeid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_listdistributionmemberid FOREIGN KEY (listmemberdistributionid)
      REFERENCES userdata.listmemberdistribution (listmemberdistributionid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_outletid FOREIGN KEY (outletid)
      REFERENCES outlets (outletid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE research.bounceddistribution OWNER TO postgres;
GRANT ALL ON TABLE research.bounceddistribution TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE research.bounceddistribution TO prmax;



CREATE TABLE queues.processqueue
(
  processqueueid serial NOT NULL,
  objectid integer,
  processid integer NOT NULL DEFAULT 1,
  statusid smallint NOT NULL DEFAULT 1,
  priority integer NOT NULL DEFAULT 1,
  CONSTRAINT pk_processqueue PRIMARY KEY (processqueueid)
)
WITH ( OIDS=FALSE);

GRANT SELECT,UPDATE,INSERT,DELETE ON queues.processqueue TO prmax;
GRANT UPDATE ON SEQUENCE queues.processqueue_processqueueid_seq TO PRmax;

CREATE SCHEMA cache AUTHORIZATION postgres;

GRANT ALL ON SCHEMA cache TO postgres;
GRANT USAGE ON SCHEMA cache TO prmax;
COMMENT ON SCHEMA cache IS 'caching schema has to be part of the main database but will put the table in their own namespace';

CREATE TABLE cache.cacheprofile
(
  outletid integer NOT NULL,
  displayprofile bytea NOT NULL,
  CONSTRAINT pk_cacheprofile PRIMARY KEY (outletid),
  CONSTRAINT fk_outletid FOREIGN KEY (outletid)
      REFERENCES outlets (outletid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
) WITH (OIDS=FALSE);
ALTER TABLE cache.cacheprofile  OWNER TO postgres;
GRANT ALL ON TABLE cache.cacheprofile TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE cache.cacheprofile TO prmax;

CREATE TABLE cache.cachestore
(
  customerid integer NOT NULL DEFAULT (-1),
  objecttypeid integer NOT NULL DEFAULT 0,
  objectid integer NOT NULL DEFAULT 0,
  cache text,
  productid integer NOT NULL,
  CONSTRAINT pk_cachestore PRIMARY KEY (customerid, objecttypeid, objectid, productid)
) WITH (  OIDS=FALSE);
ALTER TABLE cache.cachestore   OWNER TO postgres;
GRANT ALL ON TABLE cache.cachestore TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE cache.cachestore TO prmax;
COMMENT ON TABLE cache.cachestore  IS 'forward cache of complex object';

CREATE TABLE cache.cachestorelist
(
  customerid integer NOT NULL,
  objecttypeid integer NOT NULL,
  objectid integer NOT NULL,
  q_offset integer NOT NULL,
  q_limit integer NOT NULL,
  cache bytea,
  CONSTRAINT pk_cachestorelist PRIMARY KEY (customerid, objecttypeid, objectid, q_offset, q_limit)
) WITH (  OIDS=FALSE);
ALTER TABLE cache.cachestorelist OWNER TO postgres;
GRANT ALL ON TABLE cache.cachestorelist TO postgres;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE cache.cachestorelist TO prmax;
COMMENT ON TABLE cache.cachestorelist  IS 'cachestore for a list ';



CREATE TABLE cache.cacheprebuildpagestore
(
  cacheprebuildpagestoreid serial,
  objectid integer NOT NULL,
  objecttypeid integer NOT NULL,
  data bytea,
  PRIMARY KEY (cacheprebuildpagestoreid),
  UNIQUE (objecttypeid, objectid)
)
WITH (OIDS = FALSE);

GRANT SELECT,INSERT,UPDATE,DELETE ON cache.cacheprebuildpagestore TO prmax;

ALTER TABLE queues.processqueue ADD COLUMN processqueueoutput bytea;
