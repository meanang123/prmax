
CREATE OR REPLACE FUNCTION fixlist(p_listid integer)
  RETURNS VOID
  AS $$
DECLARE
BEGIN
	-- convert distribution list too a text list
	INSERT INTO userdata.listmemberdistribution(job_title,familyname,firstname,prefix,suffix,outletname,listid,listmemberid)
	SELECT e.job_title,c.familyname,c.firstname,c.prefix,c.suffix,o.outletid,lm.listid,lm.listmemberid
		FROM userdata.listmembers AS lm 
		JOIN outlets AS o ON lm.outletid = o.outletid
		LEFT OUTER JOIN employees AS e ON e.employeeid = COALESCE(e.employeeid, o.primaryemployeeid)
		LEFT OUTER JOIN contacts AS c ON c.contactid = e.contactid
		WHERE lm.listid = p_listid;

	-- fixed 
	UPDATE userdata.list SET fixed = true WHERE listid = p_listid;
END;
$$ LANGUAGE plpgsql;