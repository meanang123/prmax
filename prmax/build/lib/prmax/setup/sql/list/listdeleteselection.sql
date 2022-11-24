CREATE OR REPLACE FUNCTION listdeleteselection(p_userid integer, p_listtypeid integer)
RETURNS VOID
  AS $$
BEGIN

	DELETE FROM userdata.list
			WHERE listid IN ( SELECT lu.listid FROM userdata.listusers as lu JOIN userdata.list AS l ON l.listid = lu.listid WHERE lu.userid = p_userid AND lu.selected = true AND l.listtypeid = p_listtypeid) ;
END;
$$ LANGUAGE plpgsql;