CREATE OR REPLACE FUNCTION listmaintselectupdate(p_listid integer, p_userid integer , p_selected boolean)
RETURNS VOID
  AS $$
DECLARE
	f_listid integer;
BEGIN
	SELECT listid into f_listid from userdata.listusers WHERE userid = p_userid AND listid = p_listid;
	IF f_listid is NULL THEN
		INSERT INTO userdata.listusers(listid,userid,selected) VALUES(p_listid,p_userid,p_selected);
	ELSE
		UPDATE userdata.listusers SET selected = p_selected WHERE listid = p_listid AND userid = p_userid;
	END IF;
END;
$$ LANGUAGE plpgsql;