DROP FUNCTION saveToList(p_listid integer,p_userid integer,p_searchtypeid integer,p_overwrite integer,p_selected integer);


CREATE OR REPLACE FUNCTION saveToList(p_listid integer,
p_userid integer,
p_searchtypeid integer,
p_overwrite integer,
p_selected integer)
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
  DECLARE
  p_customerid integer;
  BEGIN
  -- Check for new session
  if p_overwrite=1 THEN
    DELETE FROM userdata.listmembers WHERE listid = p_listid;
	-- dynamic
	IF p_selected=-1 THEN
		INSERT INTO userdata.listmembers(listid,outletid,employeeid,selected)
		  SELECT p_listid,outletid,employeeid,selected FROM userdata.searchsession
		  	WHERE userid = p_userid AND searchtypeid=p_searchtypeid;
	ELSE
		INSERT INTO userdata.listmembers(listid,outletid,employeeid,selected)
		  SELECT p_listid,outletid,employeeid,selected FROM userdata.searchsession
			WHERE userid = p_userid AND searchtypeid=p_searchtypeid AND selected=p_selected::bool;
	END IF;
  ELSE
    UPDATE userdata.listmembers SET appended=false WHERE listid = p_listid;
	-- now we have a series of interesting issues
	-- 1. duplicates
	-- 2. employeeid in system is null but new record containts contact need a post import delete of those that are duplicated
	IF p_selected=-1 THEN
		-- this is n't working?
		-- we need to do this for primary contact where employrrid is null
		-- where employeeid is null

		-- for primary contacts
		INSERT INTO userdata.listmembers(listid,outletid,employeeid,selected)
		  SELECT p_listid,s.outletid,s.employeeid,s.selected FROM userdata.searchsession as s
		  	LEFT OUTER JOIN userdata.listmembers as l on s.outletid = l.outletid and l.listid = p_listid
		  	WHERE s.userid = p_userid AND s.searchtypeid=p_searchtypeid  AND
				s.employeeid IS NULL AND
				l.listid is NULL;

		INSERT INTO userdata.listmembers(listid,outletid,employeeid,selected)
		  SELECT p_listid,s.outletid,s.employeeid,s.selected FROM userdata.searchsession as s
		  	LEFT OUTER JOIN userdata.listmembers as l on s.outletid = l.outletid and s.employeeid = l.employeeid and l.listid = p_listid
		  	WHERE s.userid = p_userid AND s.searchtypeid=p_searchtypeid  AND
				s.employeeid is NOT NULL AND
				l.listid is NULL;
	ELSE
		-- 1
		INSERT INTO userdata.listmembers(listid,outletid,employeeid,selected)
		  SELECT p_listid,s.outletid,s.employeeid,s.selected FROM userdata.searchsession as s
		  	LEFT OUTER JOIN userdata.listmembers as l on s.outletid = l.outletid and l.listid = p_listid
		  	WHERE s.userid = p_userid AND s.searchtypeid=p_searchtypeid  AND
				l.listid is NULL AND userid = p_userid AND s.employeeid IS NULL AND s.selected=CAST(p_selected AS BOOLEAN);
		-- 2
		INSERT INTO userdata.listmembers(listid,outletid,employeeid,selected)
		  SELECT p_listid,s.outletid,s.employeeid,s.selected FROM userdata.searchsession as s
		  	LEFT OUTER JOIN userdata.listmembers as l on s.outletid = l.outletid and s.employeeid = l.employeeid and l.listid = p_listid
		  	WHERE s.userid = p_userid AND s.searchtypeid=p_searchtypeid  AND
				l.listid is NULL AND userid = p_userid AND s.employeeid IS NOT NULL AND s.selected=CAST(p_selected AS BOOLEAN);
	END IF;
  END IF;

    RETURN QUERY SELECT * from sessioncount(p_searchtypeid,p_userid);

  END;
$$ LANGUAGE plpgsql;
