CREATE OR REPLACE FUNCTION listduplicate(p_listid integer,
	p_listname text,
	p_customerid integer)
 RETURNS integer
  AS $$
DECLARE
p_newlistid integer;
BEGIN
-- create a new list record
	INSERT INTO userdata.list(listname, customerid) VALUES(p_listname, p_customerid);
	SELECT currval('list_listid_seq') INTO p_newlistid;
	INSERT INTO userdata.listmembers(listid,outletid,employeeid,notes,coding)
		SELECT p_newlistid,outletid,employeeid,notes,coding FROM userdata.listmembers
			WHERE listid = p_list;

	return p_newlistid;
END;
$$ LANGUAGE plpgsql;

