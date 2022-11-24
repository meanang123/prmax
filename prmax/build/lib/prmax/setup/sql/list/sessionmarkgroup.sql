DROP FUNCTION sessionmarkgroup(p_userid integer, p_searchtypeid integer, p_offset integer, p_limit integer);


CREATE OR REPLACE FUNCTION sessionmarkgroup(p_userid integer, p_searchtypeid integer, p_offset integer, p_limit integer)
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
DECLARE
BEGIN
	UPDATE userdata.searchsession SET selected = false WHERE userid = p_userid AND searchtypeid = p_searchtypeid;

	UPDATE userdata.searchsession 
		SET selected = true 
	WHERE sessionsearchid IN ( SELECT sessionsearchid FROM userdata.searchsession WHERE userid = p_userid and searchtypeid = p_searchtypeid order by sessionsearchid offset  p_offset limit p_limit );


	RETURN QUERY SELECT * from sessioncount(p_searchtypeid,p_userid);

  END;
$$ LANGUAGE plpgsql;


