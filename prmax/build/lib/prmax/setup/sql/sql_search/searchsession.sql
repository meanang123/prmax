DROP FUNCTION loadSession(commandtext bytea,p_userid integer,p_searchtypeid integer,p_newsession_in integer,p_searchtype text);

CREATE OR REPLACE FUNCTION loadSession(commandtext bytea,
p_userid integer,
p_searchtypeid integer,
p_newsession_in integer,
p_searchtype text)
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
  DECLARE
  p_customerid integer;
  p_count integer;
  p_newsession integer;
  BEGIN
  p_newsession = p_newsession_in;
  -- if this is an append and entries are 0 then chabge mode
  if p_newsession=0 THEN
	SELECT COUNT(*) INTO p_count FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
	if p_count=0 OR p_count IS NULL THEN
	p_newsession=1;
	END IF;

  END IF;
  -- Check for new session
  if p_newsession=1 THEN
    DELETE FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
  ELSE
    UPDATE userdata.searchsession SET appended=false WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
  END IF;

  SELECT INTO p_customerid customerid  from tg_user where user_id =  p_userid;

  -- put into temp table
  DROP TABLE IF EXISTS searchsession_temp;

  IF p_searchtype='quick' THEN
	CREATE temporary TABLE searchsession_temp AS SELECT p_userid as userid ,p_searchtypeid as searchtypeid,outletid,employeeid FROM doQuickSearch(commandtext) ;
  END IF;
  IF p_searchtype='outlet' THEN
	CREATE temporary TABLE searchsession_temp AS SELECT p_userid as userid ,p_searchtypeid as searchtypeid,outletid,employeeid FROM doOutletSearch(commandtext) ;
  END IF;
  IF p_searchtype='employee' THEN
	CREATE temporary TABLE searchsession_temp AS SELECT p_userid as userid ,p_searchtypeid as searchtypeid,outletid,employeeid FROM doEmployeeSearch(commandtext) ;
  END IF;
  IF p_searchtype='freelance' THEN
	CREATE temporary TABLE searchsession_temp AS SELECT p_userid as userid ,p_searchtypeid as searchtypeid,outletid,employeeid FROM doFreelanceSearch(commandtext) ;
  END IF;
  IF p_searchtype='mps' THEN
	CREATE temporary TABLE searchsession_temp AS SELECT p_userid as userid ,p_searchtypeid as searchtypeid,outletid,employeeid FROM doFreelanceSearch(commandtext) ;
  END IF;

	-- remove invoice outlets
	DELETE FROM searchsession_temp WHERE outletid IN ( SELECT s_temp.outletid FROM searchsession_temp as s_temp LEFT OUTER JOIN outlets AS o ON o.outletid = s_temp.outletid WHERE s_temp.userid = p_userid AND s_temp = searchtypeid = p_searchtypeid AND o.outletid IS NULL);


  INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,employeeid,customerid) SELECT p_userid,p_searchtypeid,outletid,employeeid,p_customerid
        FROM searchsession_temp
		WHERE 	employeeid IS NOT NULL AND
			employeeid NOT IN (SELECT employeeid FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid=p_searchtypeid AND employeeid is not null);

  INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,employeeid,customerid) SELECT p_userid,p_searchtypeid,outletid,employeeid,p_customerid
    FROM searchsession_temp
   	WHERE outletid NOT IN (SELECT outletid FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid=p_searchtypeid);

  DROP TABLE IF EXISTS searchsession_temp;

 -- missing employeeid this is loaded from the prefered at run time
  -- fix up missing outletid
  UPDATE userdata.searchsession as s
	SET outletid = e.outletid
  FROM employees as e
  WHERE s.userid = p_userid AND s.searchtypeid=p_searchtypeid AND s.outletid is NULL AND e.employeeid = s.employeeid;

  -- Remove appended marks if this is a new session
  -- this is because they are automatically added whena record is insered
  if p_newsession=1 THEN
    UPDATE userdata.searchsession SET appended=false WHERE userid = p_userid AND searchtypeid = p_searchtypeid;
  END IF;

  -- return statistics
  RETURN QUERY SELECT * from sessioncount(p_searchtypeid,p_userid);

  END;
$$ LANGUAGE plpgsql;
