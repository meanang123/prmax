

GRANT SELECT,INSERT ON TABLE actionlog TO prmax;
GRANT SELECT ON TABLE user_tmp,customer_tmp TO prmax;


GRANT UPDATE ON SEQUENCE
	actionlog_actionlogid_seq
TO prmax;