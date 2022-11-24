DROP FUNCTION IF EXISTS advance_to_standing(p_inadvancefeaturelistid integer, p_listid integer, p_prmaxroleid integer, p_selection integer );

CREATE OR REPLACE FUNCTION advance_to_standing(p_inadvancefeaturelistid integer, p_listid integer, p_prmaxroleid integer, p_selection integer)
  RETURNS VOID
  AS $$
DECLARE
BEGIN
	IF p_selection = -1 THEN
		INSERT INTO userdata.listmembers(listid,outletid,appended)
			SELECT p_listid,af.outletid,true
			FROM userdata.advancefeatureslistmembers AS aflm
			JOIN advancefeatures AS af ON af.advancefeatureid = aflm.advancefeatureid
			WHERE advancefeatureslistid = p_inadvancefeaturelistid
				AND outletid NOT IN ( SELECT outletid FROM userdata.listmembers WHERE listid = p_listid GROUP BY outletid )
			GROUP BY p_listid,af.outletid,true::integer;
	ELSE
		INSERT INTO userdata.listmembers(listid,outletid,appended)
			SELECT p_listid,af.outletid,true
		FROM userdata.advancefeatureslistmembers AS aflm
		JOIN advancefeatures AS af ON af.advancefeatureid = aflm.advancefeatureid
		WHERE advancefeatureslistid = p_inadvancefeaturelistid AND selected = p_selection::boolean
			AND outletid NOT IN ( SELECT outletid FROM userdata.listmembers WHERE listid = p_listid GROUP BY outletid )
		GROUP BY p_listid,af.outletid,true::integer;

	END IF;
END;
$$ LANGUAGE plpgsql;