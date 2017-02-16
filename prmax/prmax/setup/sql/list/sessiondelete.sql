DROP FUNCTION deletesession(p_userid integer, p_searchtypeid integer, deleteoptions integer );

CREATE OR REPLACE FUNCTION deletesession(p_userid integer, p_searchtypeid integer, deleteoptions integer )
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
DECLARE

BEGIN
	-- Delete all entries
	IF deleteoptions=-1 THEN
		DELETE FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
	ELSE

		DELETE FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid = p_searchtypeid AND selected = deleteoptions::boolean;
	END IF;

	RETURN QUERY SELECT * from sessioncount(p_searchtypeid,p_userid);
  END;
$$ LANGUAGE plpgsql;

