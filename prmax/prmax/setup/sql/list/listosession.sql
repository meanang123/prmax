DROP FUNCTION listtosession(p_listid integer,p_userid integer,p_searchtypeid integer,p_overwrite integer,p_selected integer);

CREATE OR REPLACE FUNCTION listtosession(p_listid integer,
	p_userid integer,
	p_searchtypeid integer,
	p_overwrite integer,
	p_selected integer)
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
  DECLARE
  p_customerid integer;
  BEGIN

  SELECT customerid into p_customerid FROM tg_user WHERE user_id = p_userid;

  -- Check for new session
  if p_overwrite=1 THEN
    DELETE FROM userdata.searchsession WHERE userid = p_userid and searchtypeid = p_searchtypeid;
	-- dynamic
	IF p_selected=-1 THEN
		INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,employeeid,customerid,selected)
		  SELECT p_userid,p_searchtypeid,outletid,employeeid,p_customerid,selected FROM userdata.listmembers
		  	WHERE listid = p_listid;
	ELSE
		INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,employeeid,customerid,selected)
		  SELECT p_userid,p_searchtypeid,outletid,employeeid,p_customerid,selected FROM userdata.listmembers
		  	WHERE listid = p_listid AND selected=CAST(p_selected AS BOOLEAN);
	END IF;

	UPDATE userdata.searchsession SET appended=false WHERE userid = p_userid and searchtypeid = p_searchtypeid;

  ELSE
    UPDATE userdata.searchsession SET appended=false WHERE userid = p_userid and searchtypeid = p_searchtypeid;
	IF p_selected=-1 THEN
		INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,employeeid,customerid,selected)
		  SELECT p_userid,p_searchtypeid,l.outletid,l.employeeid,p_customerid,l.selected
				FROM userdata.listmembers as l
		  		LEFT OUTER JOIN userdata.searchsession as s on s.outletid = l.outletid and s.employeeid = l.employeeid and s.userid = p_userid and s.searchtypeid = p_searchtypeid
		  	WHERE listid = p_listid AND s.sessionsearchid is NULL;
	ELSE
		INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,employeeid,customerid,selected)
		  SELECT p_userid,p_searchtypeid,l.outletid,l.employeeid,p_customerid,l.selected
				FROM userdata.listmembers as l
		  		LEFT OUTER JOIN userdata.searchsession as s on s.outletid = l.outletid and s.employeeid = l.employeeid and s.userid = p_userid and s.searchtypeid = p_searchtypeid
		  	WHERE listid = p_listid AND s.sessionsearchid is NULL AND
				l.selected=CAST(p_selected AS BOOLEAN);
	END IF;
	-- delete with duplicate where we just have outlet only
   DELETE from userdata.searchsession
	WHERE
	employeeid IS NULL AND
	outletid IN  (SELECT  s2.outletid
		FROM userdata.searchsession AS s2 JOIN outlets AS o ON o.outletid = s2.outletid
		WHERE  employeeid = o.primaryemployeeid and s2.userid = p_userid AND searchtypeid = p_searchtypeid ) AND
						userid = p_userid AND searchtypeid = p_searchtypeid;
	-- delete duplicates where we have 2+outlets and employee are bth null
	DELETE FROM userdata.searchsession
		WHERE sessionsearchid IN (
			SELECT MIN(s.sessionsearchid) from userdata.searchsession as s
				WHERE s.userid = p_userid and s.searchtypeid = p_searchtypeid and s.employeeid is null
					GROUP BY s.outletid
				HAVING COUNT(*) > 1);
  END IF;

  RETURN QUERY SELECT * from sessioncount(p_searchtypeid,p_userid);
  END;
$$ LANGUAGE plpgsql;
