-- Database: prmaxcache

-- DROP DATABASE prmaxcache;

CREATE DATABASE prmaxcache
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'English_United Kingdom.1252'
       LC_CTYPE = 'English_United Kingdom.1252'
       CONNECTION LIMIT = -1;-- Table: actionlog

-- DROP TABLE actionlog;

CREATE TABLE actionlog
(
  actionlogid serial NOT NULL,
  user_id integer,
  when_logged timestamp without time zone NOT NULL DEFAULT now(),
  url character varying(128),
  ip character varying(45),
  data text,
  when_date date,
  CONSTRAINT actionlog_pkey PRIMARY KEY (actionlogid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE actionlog
  OWNER TO postgres;
GRANT ALL ON TABLE actionlog TO postgres;
GRANT SELECT, INSERT ON TABLE actionlog TO prmax;

-- Index: index_when_date

-- DROP INDEX index_when_date;

CREATE INDEX index_when_date
  ON actionlog
  USING btree
  (when_date);


-- Trigger: action_log_insert on actionlog

-- DROP TRIGGER action_log_insert ON actionlog;

CREATE TRIGGER action_log_insert
  BEFORE INSERT
  ON actionlog
  FOR EACH ROW
  EXECUTE PROCEDURE prmax_action_index();

