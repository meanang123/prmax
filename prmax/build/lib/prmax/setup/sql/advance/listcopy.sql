CREATE OR REPLACE FUNCTION advance_list_copy(p_sourceid integer,p_destinationid integer,p_selection integer)
  RETURNS VOID
  AS $$
DECLARE
BEGIN
  -- Delete the new list
  DELETE  FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_destinationid;

  IF p_selection = -1 THEN
    INSERT INTO userdata.advancefeatureslistmembers( advancefeatureslistid, advancefeatureid )
      SELECT p_destinationid, advancefeatureid FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_sourceid;
  ELSE
    INSERT INTO userdata.advancefeatureslistmembers( advancefeatureslistid, advancefeatureid )
      SELECT p_destinationid, advancefeatureid FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_sourceid AND
        SELECTION(selected,p_selection) = true;
  END IF;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION advance_list_append(p_sourceid integer,p_destinationid integer,p_selection integer)
  RETURNS VOID
  AS $$
DECLARE
BEGIN

  IF p_selection = -1 THEN
    INSERT INTO userdata.advancefeatureslistmembers( advancefeatureslistid, advancefeatureid )
      SELECT p_destinationid, advancefeatureid FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_sourceid AND
            advancefeatureid NOT IN (SELECT advancefeatureid FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_destinationid );
  ELSE
    INSERT INTO userdata.advancefeatureslistmembers( advancefeatureslistid, advancefeatureid )
      SELECT p_destinationid, advancefeatureid FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_sourceid AND
            advancefeatureid NOT IN (SELECT advancefeatureid FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = p_destinationid ) AND
            SELECTION(selected,p_selection) = true ;
  END IF;
END;
$$ LANGUAGE plpgsql;