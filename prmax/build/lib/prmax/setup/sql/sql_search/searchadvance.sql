DROP FUNCTION IF EXISTS loadAdvance(commandtext bytea,p_userid integer,p_searchtypeid integer,p_newsession_in integer,p_searchtype text);

CREATE OR REPLACE FUNCTION loadAdvance(commandtext bytea,
p_userid integer,
p_searchtypeid integer,
p_newsession_in integer,
p_searchtype text)
  RETURNS SETOF SearchSessionStatisticsExt2
  AS $$
  DECLARE
  p_customerid integer;
  p_count integer;
  p_newsession integer;
  p_advancefeaturelistid integer;

  BEGIN
  p_newsession = p_newsession_in;
  -- get customerid
  SELECT INTO p_customerid customerid  from tg_user where user_id =  p_userid;
  -- get or create a default list
  SELECT advancefeatureslistid INTO p_advancefeaturelistid FROM userdata.advancefeatureslist WHERE userid = p_userid AND advancefeatureslisttypeid = 2;
  IF p_advancefeaturelistid IS NULL THEN
     INSERT INTO userdata.advancefeatureslist ( customerid, userid, advancefeatureslisttypeid,advancefeatureslistdescription) VALUES(p_customerid, p_userid , 2, 'Search Results' ) RETURNING advancefeatureslistid INTO p_advancefeaturelistid;
  END IF;
	-- Check for new session
  if p_newsession=1 THEN
    DELETE FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_advancefeaturelistid;
  END IF;

  DROP TABLE IF EXISTS searchadvance_temp;
  CREATE TEMPORARY TABLE searchadvance_temp AS SELECT p_advancefeaturelistid as advancefeaturelistid,outletid as advancefeatureid,employeeid FROM doAdvanceSearch(commandtext) ;

  INSERT INTO userdata.advancefeatureslistmembers(advancefeatureslistid,advancefeatureid)
		SELECT p_advancefeaturelistid,advancefeatureid FROM searchadvance_temp
		WHERE advancefeatureid NOT IN (SELECT advancefeatureid FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_advancefeaturelistid);

  -- return statistics
  RETURN QUERY SELECT * from advancecount( p_advancefeaturelistid );

  END;
$$ LANGUAGE plpgsql;
