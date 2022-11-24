CREATE OR REPLACE FUNCTION advancelistmaintselectupdate(p_listid integer, p_userid integer , p_selected boolean)
RETURNS VOID
  AS $$
DECLARE
	f_listid integer;
BEGIN
	SELECT advancefeatureslistid into f_listid from userdata.advancelistusers WHERE userid = p_userid AND advancefeatureslistid = p_listid;
	IF f_listid is NULL THEN
		INSERT INTO userdata.advancelistusers(advancefeatureslistid,userid,selected) VALUES(p_listid,p_userid,p_selected);
	ELSE
		UPDATE userdata.advancelistusers SET selected = p_selected WHERE advancefeatureslistid = p_listid AND userid = p_userid;
	END IF;
END;
$$ LANGUAGE plpgsql;