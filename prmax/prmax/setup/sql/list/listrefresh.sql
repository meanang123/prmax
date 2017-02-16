-- write in the job role id if possible
-- attempt to replace if possible ignores self and other deleted ones
-- write all that left to null and set flag
CREATE OR REPLACE FUNCTION list_refresh ( p_listid integer)
RETURNS void AS $$
DECLARE
	used_count integer;
BEGIN
 used_count := 0;
-- write in the job role id if possible
UPDATE userdata.listmembers AS lm
SET prmaxroleid = pr.prmaxroleid
FROM employees AS e
JOIN employeeprmaxroles AS pr ON pr.employeeid = e.employeeid
WHERE e.prmaxstatusid = 2 AND lm.listid = p_listid AND e.employeeid = lm.employeeid;
-- attempt to replace if possible ignores self and other deleted ones
UPDATE userdata.listmembers AS lm
SET employeeid = e.employeeid,
		prmaxroleid = NULL
FROM employees AS e
JOIN employeeprmaxroles AS pr ON e.employeeid  = pr.employeeid
WHERE 	e.prmaxstatusid != 2 AND
	lm.listid = p_listid AND
	e.outletid = lm.outletid AND
	lm.employeeid != e.employeeid AND
	pr.prmaxroleid = lm.prmaxroleid;

-- write all that left to null and set flag
-- Need to check dusplicates
UPDATE userdata.listmembers AS lm
SET employeeid = NULL,
    refresh_set_to_default = true
FROM employees AS e
LEFT OUTER JOIN employeeprmaxroles AS pr ON pr.employeeid = e.employeeid
WHERE e.prmaxstatusid = 2 AND lm.listid = p_listid AND e.employeeid = lm.employeeid AND
NOT EXISTS (SELECT outletid FROM listmembers AS lm2 WHERE lm2.outletid = lm.outletid AND lm2.employeeid) IS NULL;
-- No we need to delete those that
--


END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

