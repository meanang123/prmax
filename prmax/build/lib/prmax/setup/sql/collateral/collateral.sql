CREATE OR REPLACE FUNCTION listcollateralselectupdate(p_collateralid integer, p_userid integer , p_selected boolean)
RETURNS VOID
  AS $$
DECLARE
	f_collateralid integer;
BEGIN
	SELECT collateralid into f_collateralid from userdata.collateralusers WHERE userid = p_userid AND collateral = p_collateral;
	IF f_collateralid is NULL THEN
		INSERT INTO userdata.collateralusers(collateralid,userid,selected) VALUES(p_collateralid,p_userid,p_selected);
	ELSE
		UPDATE userdata.collateralusers SET selected = p_selected WHERE collateralid = p_collateralid AND userid = p_userid;
	END IF;
END;
$$ LANGUAGE plpgsql;