
CREATE OR REPLACE FUNCTION research_project_update ( p_searchtypeid integer, p_userid integer, p_researchprojectid integer, p_researchprojectstatusid integer )
RETURNS integer AS $$

BEGIN

INSERT INTO research.researchprojectitem ( researchprojectid, outletid, researchprojectstatusid, lastationdate, lastactionownerid)
	SELECT p_researchprojectid, s.outletid, p_researchprojectstatusid, now(), p_userid
	FROM userdata.searchsession AS s
	WHERE s.userid = p_userid AND searchtypeid = p_searchtypeid AND
	s.outletid NOT IN ( SELECT outletid FROM research.researchprojectitem WHERE researchprojectid = p_researchprojectid AND outletid = s.outletid );

RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
