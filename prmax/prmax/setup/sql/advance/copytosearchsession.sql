CREATE OR REPLACE FUNCTION copy_advance_session(p_customerid integer,p_userid integer, p_searchtypeid integer, p_advancefeatureslistid integer, p_selection integer )
  RETURNS VOID
  AS $$
DECLARE
BEGIN

DELETE FROM userdata.searchsession WHERE userid = p_userid AND searchtypeid = p_searchtypeid;

INSERT INTO userdata.searchsession(customerid,userid,searchtypeid,outletid,employeeid)
    SELECT p_customerid,p_userid,p_searchtypeid, o.outletid,COALESCE(a.employeeid,o.primaryemployeeid) AS employeeid
    FROM userdata.advancefeatureslistmembers AS afl JOIN advancefeatures AS a ON a.advancefeatureid = afl.advancefeatureid JOIN outlets AS o ON o.outletid = a.outletid
    WHERE afl.advancefeatureslistid = p_advancefeatureslistid AND ( p_selection = -1 OR ( p_selection != -1 AND selected = p_selection::boolean))
    GROUP BY o.outletid,COALESCE(a.employeeid,o.primaryemployeeid);

END;
$$ LANGUAGE plpgsql;
