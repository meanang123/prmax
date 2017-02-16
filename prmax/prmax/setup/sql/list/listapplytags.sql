CREATE OR REPLACE FUNCTION listapplytags(p_userid integer,p_searchtypeid integer, p_interests integer[], p_selected integer, p_employeeid boolean )
  RETURNS integer
  AS $$
DECLARE
i integer;
retvalue integer;
l_interest integer;
BEGIN
  -- This is quite comples
  FOR i IN array_lower(p_interests,1) .. array_upper(p_interests,1) LOOP
	l_interest:=p_interests[i];
	-- need to join list outlet/employee with current interest to get not list
	-- need to insert interest where not in list
	if p_employeeid=true THEN
		-- capture the count
		-- need to handle freelance and mps
		SELECT
			COUNT(*) into retvalue
		FROM userdata.searchsession as ss
		JOIN outlets as o on o.outletid = ss.outletid
		LEFT OUTER JOIN employeeinterests as ei on COALESCE(ss.employeeid,o.primaryemployeeid)=ei.employeeid AND
					ei.interestid = l_interest AND
					( ei.customerid=-1 OR ei.customerid=ss.customerid)
		WHERE userid = p_userid and searchtypeid = p_searchtypeid AND ei.interestid IS NULL AND
			(p_selected=-1 OR ( p_selected != -1 AND ss.selected = p_selected::boolean))
			AND o.outlettypeid NOT IN (19,41);
		-- do the actual outlets
		INSERT INTO employeeinterests(employeeid,customerid,interestid)
			SELECT
				DISTINCT
				COALESCE(ss.employeeid,o.primaryemployeeid) as employeeid,
				ss.customerid,
				l_interest
			FROM userdata.searchsession as ss
			JOIN outlets as o on o.outletid = ss.outletid
			LEFT OUTER JOIN employeeinterests as ei on COALESCE(ss.employeeid,o.primaryemployeeid)=ei.employeeid AND
						ei.interestid = l_interest AND
						( ei.customerid=-1 OR ei.customerid=ss.customerid)
			WHERE userid = p_userid and searchtypeid = p_searchtypeid AND ei.interestid IS NULL AND
				(p_selected=-1 OR ( p_selected != -1 AND ss.selected = p_selected::boolean))
				AND o.outlettypeid NOT IN (19,41);
		-- now do individuals in the list
		INSERT INTO outletinterests(outletid,customerid,interestid)
			SELECT
				DISTINCT
				ss.outletid,
				ss.customerid,
				l_interest
			FROM userdata.searchsession as ss
			JOIN outlets as o on o.outletid = ss.outletid
			LEFT OUTER JOIN outletinterests as oi on ss.outletid=oi.outletid AND
						oi.interestid = l_interest AND
						( oi.customerid=-1 OR oi.customerid=ss.customerid)
			WHERE userid = p_userid and searchtypeid = p_searchtypeid AND oi.interestid IS NULL AND
				(p_selected=-1 OR ( p_selected != -1 AND ss.selected = p_selected::boolean))
				AND o.outlettypeid IN (19,41);
	ELSE
		-- capture the count
		SELECT
			COUNT(*) into retvalue
		FROM userdata.searchsession as ss
		JOIN outlets as o on o.outletid = ss.outletid
		LEFT OUTER JOIN outletinterests as oi on ss.outletid=oi.outletid AND
					oi.interestid = l_interest AND
					( oi.customerid=-1 OR oi.customerid=ss.customerid)
		WHERE userid = p_userid and searchtypeid = p_searchtypeid AND oi.interestid IS NULL AND
		 (p_selected=-1 OR ( p_selected != -1 AND ss.selected = p_selected::boolean));
		-- do insetrs
		INSERT INTO outletinterests(outletid,customerid,interestid)
			SELECT
				DISTINCT
				ss.outletid,
				ss.customerid,
				l_interest
			FROM userdata.searchsession as ss
			JOIN outlets as o on o.outletid = ss.outletid
			LEFT OUTER JOIN outletinterests as oi on ss.outletid=oi.outletid AND
						oi.interestid = l_interest AND
						( oi.customerid=-1 OR oi.customerid=ss.customerid)
			WHERE userid = p_userid and searchtypeid = p_searchtypeid AND oi.interestid IS NULL AND
				(p_selected=-1 OR ( p_selected != -1 AND ss.selected = p_selected::boolean));
	END IF;
  END LOOP;

  RETURN retvalue;
END;
$$ LANGUAGE plpgsql;