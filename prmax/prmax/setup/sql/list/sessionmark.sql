DROP FUNCTION marksession(p_userid integer, p_searchtypeid integer, p_markstyle integer );


CREATE OR REPLACE FUNCTION marksession(p_userid integer, p_searchtypeid integer, p_markstyle integer )
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
DECLARE
BEGIN
	-- Marks all the entries in a list
	IF p_markstyle=0 THEN
		UPDATE userdata.searchsession SET selected = True WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
	END IF;
	-- Invert the maked entries
	IF p_markstyle=1 THEN
		UPDATE userdata.searchsession SET selected = CASE WHEN selected=true THEN false ELSE true END  WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
	END IF;
	-- clear marks
	IF p_markstyle=2 THEN
		UPDATE userdata.searchsession SET selected = False WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
	END IF;
	-- clear marks and marked those that have append as selected
	IF p_markstyle=3 THEN
		UPDATE userdata.searchsession SET selected = False WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
		UPDATE userdata.searchsession SET selected = true WHERE userid = p_userid AND searchtypeid = p_searchtypeid AND appended = True;
	END IF;
	-- mark appended entries as true
	IF p_markstyle=4 THEN
		UPDATE userdata.searchsession SET selected = true WHERE userid = p_userid AND searchtypeid = p_searchtypeid AND appended = True;
	END IF;

	RETURN QUERY SELECT * from sessioncount(p_searchtypeid,p_userid);

  END;
$$ LANGUAGE plpgsql;

