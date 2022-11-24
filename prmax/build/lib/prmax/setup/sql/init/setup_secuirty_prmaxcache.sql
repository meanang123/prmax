

GRANT SELECT,INSERT ON TABLE actionlog TO prmax;
GRANT SELECT ON TABLE user_tmp,customer_tmp TO prmax;


GRANT UPDATE ON SEQUENCE
	actionlog_actionlogid_seq
TO prmax;

CREATE TABLE customer_tmp
(
customerid integer,
customername character varying,
	PRIMARY KEY (customerid)
) WITH (OIDS = FALSE);

CREATE TABLE user_tmp
(
user_name character varying(80),
customerid integer,
user_id integer NOT NULL,
PRIMARY KEY (user_id)
) WITH (OIDS = FALSE);

