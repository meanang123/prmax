DROP FUNCTION advance_deleteselection(p_advancefeatureslistid integer, deleteoptions integer );


CREATE OR REPLACE FUNCTION advance_deleteselection(p_advancefeatureslistid integer, deleteoptions integer )
  RETURNS SETOF SearchSessionStatisticsExt2
  AS $$
DECLARE

BEGIN
	-- Delete all entries
	IF deleteoptions=-1 THEN
		DELETE FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_advancefeatureslistid;
	ELSE

		DELETE FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_advancefeatureslistid AND selected = deleteoptions::boolean;
	END IF;

	RETURN QUERY SELECT * from advancecount(p_advancefeatureslistid);
  END;
$$ LANGUAGE plpgsql;

