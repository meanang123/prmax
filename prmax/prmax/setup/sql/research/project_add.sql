
CREATE OR REPLACE FUNCTION research_project_add ( p_searchtypeid integer, p_userid integer, p_researchprojectid integer, p_researchprojectstatusid integer )
RETURNS integer AS $$

BEGIN

INSERT INTO research.researchprojectitem ( researchprojectid, outletid, researchprojectstatusid, lastationdate, lastactionownerid)
	SELECT p_researchprojectid, s.outletid, p_researchprojectstatusid, now(), p_userid FROM userdata.searchsession AS s WHERE s.userid = p_userid AND searchtypeid = p_searchtypeid;

RETURN 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
